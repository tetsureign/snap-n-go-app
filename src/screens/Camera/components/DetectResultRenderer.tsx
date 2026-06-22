import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {GeneralButton} from '@/components/Buttons';
import {DetectionResultType} from '@/types/detection';
import {styles} from './DetectResultRenderer.styles';

type Props = {
  element: DetectionResultType;
  index: number;
  isReliable: boolean;
  renderType: 'button' | 'rect';
  isSelected: boolean;
  onSelect: (index: number) => void;
  resizeRatio: number;
};

const DetectResultRendererComponent = ({
  element,
  index,
  isReliable,
  renderType,
  isSelected,
  onSelect,
  resizeRatio,
}: Props) => {
  const buttonStyle = !isSelected && styles.itemBackground;
  const textStyle = [
    styles.itemsText,
    isReliable ? styles.itemsTextWhite : styles.itemsTextFade,
    isSelected && styles.itemsTextWhite,
  ];

  const rectStyle = {
    width: (element.coordinate.x1 - element.coordinate.x0) * resizeRatio,
    height: (element.coordinate.y1 - element.coordinate.y0) * resizeRatio,
    left: element.coordinate.x0 * resizeRatio,
    top: element.coordinate.y0 * resizeRatio,
  };

  return (
    <>
      {renderType === 'button' ? (
        <GeneralButton style={buttonStyle} onPress={() => onSelect(index)}>
          <View style={styles.itemsTextContainer}>
            <Text style={textStyle}>{element.object}</Text>
            <Text style={textStyle}>{Math.round(element.score)}%</Text>
          </View>
        </GeneralButton>
      ) : (
        <TouchableOpacity
          onPress={() => onSelect(index)}
          style={[
            styles.rect,
            isReliable && styles.rectFade,
            isSelected && styles.rectWhite,
            rectStyle,
          ]}
        />
      )}
    </>
  );
};

export const DetectResultRenderer = React.memo(DetectResultRendererComponent);
