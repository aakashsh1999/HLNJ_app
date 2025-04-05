import React, { useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet } from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [scrollY] = useState(new Animated.Value(0));

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: ["transparent", "rgba(255, 255, 255, 0.8)"],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 0.2],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.header,
        { backgroundColor: headerBackgroundColor, shadowOpacity },
      ]}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    // position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingVertical: 10,
    // paddingHorizontal: 16,
    elevation: 4,
  },
  container: {
    
    // maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    fontFamily: "Poppins",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontFamily: "Poppins",
  },
});

export default Header;
