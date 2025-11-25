import Animated, { SlideOutLeft, SlideInLeft } from "react-native-reanimated";

type Props = {
  isOpen: boolean;
  withInput?: boolean;
  isTransparent?: boolean;
  children: React.ReactNode;
  backgroundColor?: string;
};

const ModalInternal = (props: Props) => {
  ////vars
  const {
    isOpen,
    withInput,
    children,
    isTransparent = true,
    backgroundColor,
  } = props;

  let currentBackgroundColor = "";
  if (backgroundColor && !isTransparent)
    currentBackgroundColor = backgroundColor;
  if (isTransparent) currentBackgroundColor = "transparent";

  ////tsx
  return (
    <>
      {isOpen ? (
        <Animated.View
          style={{ backgroundColor: currentBackgroundColor }}
          className="absolute top-0 bottom-0 left-0 right-0 bg-background-nuance"
          entering={SlideInLeft.duration(100).damping(11)}
          exiting={SlideOutLeft.duration(200)}
        >
          {children}
        </Animated.View>
      ) : null}
    </>
  );
};
export default ModalInternal;
