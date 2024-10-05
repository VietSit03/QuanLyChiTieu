import { ActivityIndicator } from "react-native";

export const LoadingPage = () => {
  return <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />;
};

export const LoadingAction = () => {
  return <ActivityIndicator size={"large"} style={{ marginBottom: 10 }} />;
};
