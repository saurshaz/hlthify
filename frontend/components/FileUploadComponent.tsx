import React, { useState } from 'react';
import { Platform, ScrollView, TouchableOpacity, Button, Text, View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { Camera, GalleryVerticalIcon, ImageIcon, Upload } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';


const FileUploadComponent = ({ styles }) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
    const pickImage = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("You need to enable gallery permissions to pick an image!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    };
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You need to enable camera permissions to take a photo!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadFile = async () => {
    try {
      // Step 1: Pick a PDF file
      const pickerResult = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (pickerResult.canceled) {
        alert('No file selected');
        return;
      }

      // Step 2: Handle platform-specific file preparation
      const formData = new FormData();
      const fileAsset = pickerResult.assets[0];

      if (Platform.OS === 'web') {
        // For Web: Fetch the file as a Blob and create a File object
        const response = await fetch(fileAsset.uri);
        const blob = await response.blob();
        const file = new File([blob], fileAsset.name, { type: 'application/pdf' });
        formData.append('file', file);
      } else {
        // For Mobile: Use the URI directly
        formData.append('file', {
          uri: fileAsset.uri,
          name: fileAsset.name || 'file.pdf',
          type: 'application/pdf',
        });
      }

      // Step 3: Upload the file
      setUploading(true);
      const response = await fetch('http://localhost:8088/upload/', {
        method: 'POST',
        body: formData,
        headers: {
          // Let the runtime set Content-Type automatically
        },
      });

      const result = await response.json();
      console.log('Upload successful:', result);
      alert('PDF uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView>


      <View style={{ padding: 60 }}>
        <TouchableOpacity style={{ ...styles.uploadButton, ...styles.buttonText }} onPress={uploadFile} disabled={uploading}>
          <Upload size={44} color="#ffffff" style={styles.buttonText} title="Upload PDF" />
        </TouchableOpacity>
        {uploading && (
          <View style={{ marginTop: 20 }}>
            <Text>Uploading...</Text>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        )}
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
              <Text style={styles.buttonText}>Choose Another Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <ImageIcon size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Open Gallery</Text>
          </TouchableOpacity>
        )}
      </View>


      <View style={{ padding: 60 }}>
        <TouchableOpacity style={{ ...styles.uploadButton, ...styles.buttonText }} onPress={takePhoto} disabled={uploading}>
          <Camera size={44} color="#ffffff" style={styles.buttonText} title="Take a Picture" />
        </TouchableOpacity>
        {photo ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity style={styles.retakeButton} onPress={takePhoto}>
              <Text style={styles.buttonText}>Take Another Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
            <Camera size={24} color="#ffffff" />
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ padding: 60 }}>
        <TouchableOpacity style={{ ...styles.uploadButton, ...styles.buttonText }} onPress={pickImage} disabled={uploading}>
          <GalleryVerticalIcon size={44} color="#ffffff" style={styles.buttonText} title="Pick a Picture" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FileUploadComponent;