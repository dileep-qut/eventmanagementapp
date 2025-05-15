
import {
  Text,
  Stack,
} from "@mantine/core";

import { useMediaQuery } from "@mantine/hooks";

export default function CircleWithIcon({ icon, text, selected, onClick }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const circleSize = isMobile ? 50 : 90;
  const iconSize = isMobile ? 20 : 30;

  return (
    <Stack
      align="center"
      spacing="xs"
      style={{
        flex: "1 0 auto",
        textAlign: "center",
        cursor: "pointer",
        opacity: selected ? 1 : 0.6,
        transform: selected ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s',
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          border: `2px solid ${selected ? '#007bff' : '#ACAEAF'}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selected ? '#e9f3ff' : 'transparent',
        }}
      >
        <img
          src={icon}
          alt="Icon"
          style={{ width: iconSize, height: iconSize }}
        />
      </div>
      <Text size="sm" fw={500} ta="center">
        {text}
      </Text>
    </Stack>
  );
}