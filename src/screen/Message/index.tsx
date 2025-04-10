import {fetchReadMessage, getMessageList} from '@api/app/message';
import moment from 'moment';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const MessageItem = React.memo(({item, msgType}: any) => {
  return (
    <View style={styles.messageItem}>
      <View style={styles.messageHeader}>
        <Image
          source={
            msgType === 0
              ? require('@assets/images/megaphone.png')
              : require('@assets/images/user.png')
          }
          style={styles.messageIcon}
        />
        <Text style={styles.messageTitle}>
          {msgType === 0 ? item.letter.title : '客服消息'}
        </Text>
        {item.status === 1 && <View style={styles.unreadIndicator} />}
      </View>
      <Text style={styles.messageContent}>{item.letter.content}</Text>
      {item.letter?.imgUrl && (
        <Image source={{uri: item.letter.imgUrl}} style={styles.messageImage} />
      )}
      <Text style={styles.messageTime}>
        {moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')}
      </Text>
    </View>
  );
});

export default function Message() {
  const {mutateAsync: readMsg} = fetchReadMessage();
  const {data, refetch: refetchMessage} = getMessageList();
  const [unreadCount, setUnreadCount] = useState({msg: 0, sys: 0});
  const [isAnimating, setIsAnimating] = useState(false);
  const [msgType, setMsgType] = useState(1);

  // 动画值
  const fadeAnimA = useRef(new Animated.Value(0)).current;
  const fadeAnimB = useRef(new Animated.Value(999)).current;

  // 计算未读消息数
  useEffect(() => {
    if (data?.length > 0) {
      const unread = {sys: 0, msg: 0};
      data.forEach((item: any) => {
        if (item?.letter?.platform === 1 && item?.status === 1) {
          unread.sys += 1;
        }
        if (item?.letter?.platform === 3 && item?.status === 1) {
          unread.msg += 1;
        }
      });
      setUnreadCount(unread);
    }
  }, [data]);

  // 过滤后的数据
  const filteredData = useMemo(
    () => data?.filter((item: any) => item.letter.platform === msgType) || [],
    [data, msgType],
  );

  // 显示消息详情页
  const showB = useCallback(() => {
    if (isAnimating) {
      return;
    }
    setIsAnimating(true);

    // 停止任何正在进行的动画
    fadeAnimA.stopAnimation();
    fadeAnimB.stopAnimation();

    Animated.parallel([
      Animated.timing(fadeAnimA, {
        toValue: 999,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimB, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setIsAnimating(false));
  }, [isAnimating, fadeAnimA, fadeAnimB]);

  // 返回消息列表页
  const showA = useCallback(() => {
    if (isAnimating) {
      return;
    }
    setIsAnimating(true);

    fadeAnimA.stopAnimation();
    fadeAnimB.stopAnimation();

    Animated.parallel([
      Animated.timing(fadeAnimA, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimB, {
        toValue: 999,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMsgType(1);
      setIsAnimating(false);
    });
  }, [isAnimating, fadeAnimA, fadeAnimB]);

  return (
    <View style={styles.container}>
      {/* 消息列表页 */}
      <Animated.View
        style={[styles.listContainer, {transform: [{translateY: fadeAnimA}]}]}>
        <Text style={styles.title}>消息</Text>

        <View style={styles.messageTypeContainer}>
          <Pressable
            style={styles.messageTypeItem}
            onPress={() => {
              setMsgType(3);
              showB();
              readMsg({platform: 3});
            }}>
            <Image
              style={styles.messageTypeIcon}
              source={require('@assets/images/user.png')}
            />
            <Text style={styles.messageTypeText}>客服消息</Text>
            {unreadCount?.msg > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount?.msg}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </Animated.View>

      {/* 消息详情页 */}
      <Animated.View
        style={[
          styles.detailContainer,
          {transform: [{translateY: fadeAnimB}]},
        ]}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item.recordId}
          renderItem={({item}) => <MessageItem item={item} msgType={msgType} />}
          ListEmptyComponent={<Text style={styles.emptyText}>暂无消息</Text>}
          contentContainerStyle={styles.flatListContent}
        />

        <Pressable
          style={styles.closeButton}
          onPress={async () => {
            await refetchMessage();
            showA();
          }}>
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
  title: {
    marginLeft: 16,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageTypeContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20,
  },
  messageTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageTypeIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
  },
  messageTypeText: {
    fontSize: 16,
  },
  unreadBadge: {
    marginLeft: 'auto',
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  detailContainer: {
    position: 'absolute',
    top: StatusBar.currentHeight,
    left: '5%',
    width: '90%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  messageItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginLeft: 8,
  },
  messageContent: {
    paddingLeft: 32,
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  messageImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 8,
  },
  messageTime: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    left: '50%',
    zIndex: 2,
    padding: 10,
    transform: [{translateX: -18}],
  },
  closeButtonText: {
    height: 36,
    width: 36,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 18,
    textAlign: 'center',
    lineHeight: 36,
    color: 'white',
    fontSize: 16,
  },
});
