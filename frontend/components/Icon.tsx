import { Platform } from 'react-native';
import { Video as LucideIcon, TableProperties as LucideProps } from 'lucide-react-native';

export function Icon(props: LucideProps & { icon: LucideIcon }) {
  const { icon: IconComponent, ...iconProps } = props;
  
  // Remove accessibility props on web platform
  const platformProps = Platform.select({
    web: {
      ...iconProps,
      accessibilityHint: undefined,
      accessibilityLabel: undefined,
    },
    default: iconProps,
  });

  return <IconComponent {...platformProps} />;
}