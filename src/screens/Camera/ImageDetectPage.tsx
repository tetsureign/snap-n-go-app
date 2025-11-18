import {ArrowLeft, Refresh, Search} from 'iconoir-react-native';
import React from 'react';
import {ImageBackground, View} from 'react-native';

import {DarkPersistentActionSheet} from '@/components/ActionSheet/';
import {GoButton} from '@/components/Buttons';
import {ErrorChip} from '@/components/ErrorMessage';
import FocusAwareStatusBar from '@/components/FocusAwareStatusBar';
import {LoadingIndicator} from '@/components/LoadingIndicator';
import {SelectedResultContext} from '@/contexts/DetectionResultContext';
import {DarkTheme} from '@/styles/theme';
import {DetectionResultType} from '@/types/detection';
import {ImageDetectPageProps} from '@/types/navigation';

import {DetectResultRenderer} from '@/screens/Camera/components/DetectResultRenderer';
import {useImageDetect} from '@/screens/Camera/hooks/useImageDetect';
import {styles} from '@/screens/Camera/ImageDetectPage.styles';

type DetectResultProps = {
  fetchResult: DetectionResultType[];
  type: 'button' | 'rect';
};

const RELIABILITY_THRESHOLD = 70;

const DetectResult = ({fetchResult, type}: DetectResultProps) => {
  return fetchResult.map((element, index) => {
    const isReliable = element.score >= RELIABILITY_THRESHOLD;
    return (
      <DetectResultRenderer
        element={element}
        index={index}
        key={index}
        isReliable={isReliable}
        renderType={type}
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
              <SelectedResultContext.Provider
                value={{
                  selectedResult,
                  setSelectedResult,
                  resizeRatio,
                }}>
                <DetectResult
                  fetchResult={detectionState.fetchResult}
                  type="rect"
                />
              </SelectedResultContext.Provider>
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
        <View style={styles.actionSheetItems}>
          {/* The main buttons */}
          {detectionState.fetchResult?.length ? (
            <SelectedResultContext.Provider
              value={{
                selectedResult,
                setSelectedResult,
              }}>
              <DetectResult
                fetchResult={detectionState.fetchResult}
                type="button"
              />
            </SelectedResultContext.Provider>
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
