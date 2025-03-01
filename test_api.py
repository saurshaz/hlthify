import requests

def test_upload():
    url = "http://localhost:8000/upload/"
    files = {"file": open("medical_report.pdf", "rb")}
    response = requests.post(url, files=files)
    print(response.json())

if __name__ == "__main__":
    test_upload()
