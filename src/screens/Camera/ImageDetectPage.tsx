import {ArrowLeft, Refresh, Search} from 'iconoir-react-native';
import React, {useCallback} from 'react';
import {ImageBackground, View} from 'react-native';

import {DarkPersistentActionSheet} from '@/components/ActionSheet/';
import {GoButton} from '@/components/Buttons';
import {ErrorChip} from '@/components/ErrorMessage';
import FocusAwareStatusBar from '@/components/FocusAwareStatusBar';
import {LoadingIndicator} from '@/components/LoadingIndicator';
import {DarkTheme} from '@/styles/theme';
import {DetectionResultType} from '@/types/detection';
import {ImageDetectPageProps} from '@/types/navigation';

import {DetectResultRenderer} from '@/screens/Camera/components/DetectResultRenderer';
import {useImageDetect} from '@/screens/Camera/hooks/useImageDetect';
import {styles} from '@/screens/Camera/ImageDetectPage.styles';

type DetectResultProps = {
  fetchResult: DetectionResultType[];
  type: 'button' | 'rect';
  selectedResult: {result: string; index: number};
  setSelectedResult: (
    value: React.SetStateAction<{result: string; index: number}>,
  ) => void;
  resizeRatio: number;
};

const RELIABILITY_THRESHOLD = 70;
const DetectResult = ({
  fetchResult,
  type,
  selectedResult,
  setSelectedResult,
  resizeRatio,
}: DetectResultProps) => {
  const handleSelect = useCallback(
    (index: number) => {
      setSelectedResult(prev =>
        prev.index === index
          ? {result: '', index: -1}
          : {result: fetchResult[index].object, index},
      );
    },
    [fetchResult, setSelectedResult],
  );

  return fetchResult.map((element, index) => {
    const isReliable = element.score >= RELIABILITY_THRESHOLD;
    const isSelected = selectedResult.index === index;

    return (
      <DetectResultRenderer
        element={element}
        index={index}
        key={index}
        isReliable={isReliable}
        renderType={type}
        isSelected={isSelected}
        onSelect={handleSelect}
        resizeRatio={resizeRatio || 1}
      />
    );
  });
};

const ImageDetectPage = ({route, navigation}: ImageDetectPageProps) => {
  const {
    photo,
    setResizeRatio,
    setImageWidthDevice,
    detectionState,
    imageWidthDevice,
    resizeRatio,
    selectedResult,
    setSelectedResult,
    headerHeight,
    resultsActionSheetRef,
    initSnapPoint,
    setSheetChildrenHeight,
    goBack,
    getData,
    searchMap,
  } = useImageDetect({route, navigation});

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle={'light-content'} />
      <ImageBackground
        source={{uri: photo.uri}}
        style={styles.background}
        resizeMode={'contain'}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setResizeRatio(width / photo.width);
          setImageWidthDevice(width);
        }}>
        {/* Detection rectangles */}
        {detectionState.fetchResult?.length && (
          <View style={styles.rectContainer}>
            <View
              style={{
                width: imageWidthDevice,
                height: photo.height * resizeRatio,
              }}>
              <DetectResult
                fetchResult={detectionState.fetchResult}
                type="rect"
                selectedResult={selectedResult}
                setSelectedResult={setSelectedResult}
                resizeRatio={resizeRatio}
              />
            </View>
          </View>
        )}

        {/* Error chip */}
        {detectionState.status && (
          <View style={styles.errorContainer}>
            <View style={{marginTop: headerHeight + DarkTheme.spacing.md}} />
            <ErrorChip status={detectionState.status} />
          </View>
        )}
      </ImageBackground>

      <DarkPersistentActionSheet
        innerRef={resultsActionSheetRef}
        snapPoints={[initSnapPoint, 100]}
        initialSnapIndex={1}
        onChange={(position, height) => {
          setSheetChildrenHeight(height);
        }}>
        <View style={[styles.actionSheetItems]}>
          {/* The main buttons */}
          {detectionState.fetchResult?.length ? (
            <DetectResult
              fetchResult={detectionState.fetchResult}
              type="button"
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
              resizeRatio={resizeRatio}
            />
          ) : detectionState.status === 'empty' ? (
            <GoButton
              onPress={goBack}
              icon={<ArrowLeft />}
              text={'Trở về'}
              color={DarkTheme.colors.blue}
            />
          ) : (
            <GoButton
              onPress={() => getData(photo.uri)}
              icon={<Refresh />}
              text={'Thử lại'}
              color={DarkTheme.colors.blue}
            />
          )}

          {/* The search button.*/}
          {selectedResult.result && (
            <View style={styles.actionButtons}>
              <GoButton
                onPress={searchMap}
                icon={<Search />}
                text={'Tìm kiếm'}
                color={DarkTheme.colors.blue}
              />
            </View>
          )}
        </View>
      </DarkPersistentActionSheet>

      {/* Loading indicator */}
      {detectionState.isLoading && <LoadingIndicator />}
    </View>
  );
};

export default ImageDetectPage;
