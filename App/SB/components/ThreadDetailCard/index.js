import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import moment from 'moment'
import ProgressiveImage from '../../../Components/ProgressiveImage'
import { getHeight } from '../../../Services/PhotoUtils'
import Avatar from '../../../Components/Avatar'
import UIActions from '../../../Redux/UIRedux'

import styles from './statics/styles'

const WIDTH = Dimensions.get('window').width

class ThreadDetailCard extends React.PureComponent {
  renderLikes (isLiked, didLike, photo) {
    // you are the only like or there are no likes, return ''
    return !isLiked || (didLike && photo.likes.length === 1) ? undefined
      : (<Text style={[styles.likedText]}>
        <Text style={[styles.profileName]}>{photo.likes.length.toString() + (photo.likes.length > 1 ? ' likes' : ' like')}</Text>
      </Text>)
  }

  render () {
    const {
      profile,
      item,
      peerId,
      dateString,
      defaultSource,
      didLike,
      isLiked,
      imageHeight,
      imageWidth,
      username,
      onSelect
    } = this.props
    const photo = item.photo
    const likeRow = this.renderLikes(isLiked, didLike, photo)
    let caption
    if (photo.caption && photo.caption.length > 0) {
      caption = <Text style={[styles.captionText]}>
        <Text style={[styles.profileName]}>{username}</Text>
        {' '}
        {photo.caption}
      </Text>
    } else {
      caption = <Text>{''}</Text>
    }
    return (
      <TouchableWithoutFeedback onPress={onSelect}>
        <View style={styles.card}>
          <View style={styles.cardHeader} >
            <Avatar style={styles.cardAvatar} width={18} height={18} peerId={peerId} defaultSource={defaultSource} />
            <Text style={styles.cardAction}><Text style={styles.cardActionName}>
              {profile && profile.username === username ? 'You' : username}
            </Text> added a photo</Text>
          </View>
          <View style={[styles.cardImage, {width: imageWidth, height: imageHeight}]}>
            <View style={styles.imageStretch}>
              <ProgressiveImage
                imageId={photo.id}
                previewPath={'small'}
                path={'medium'}
                style={[styles.image, {width: imageWidth, height: imageHeight}]}
                resizeMode={'cover'}
                width={imageWidth}
                height={imageHeight}
              />
            </View>
          </View>
          <View style={styles.cardFooter} >
            <View style={styles.cardFooterTop} >
              {didLike && <ImageSc width={32} source={require('../../../Images/v2/hearted.png')} />}
              {!didLike && <TouchableOpacity onPress={() => {
                this.props.addPhotoLike(photo.block_id)
              }}>
                <ImageSc width={32} source={require('../../../Images/v2/heart.png')} />
              </TouchableOpacity>}
            </View>
            {isLiked && likeRow
            }
            {caption}
            <View style={styles.cardFooterBottom} >
              <Text style={styles.detailUpdateTime}>{dateString.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { profile, item } = ownProps
  const photo = item.photo
  const date = moment(photo.date)
  const dateString = date.fromNow()
  const selfId = profile && profile.id

  const username = photo.username ? photo.username : photo.author_id.substring(0, 8)

  const defaultSource = require('../../views/Notifications/statics/main-image.png')

  const totalLikes = photo.likes ? photo.likes.length : 0
  const isLiked = photo.likes && photo.likes.length > 0
  const didLike = isLiked && photo.likes.find((like) => like.author_id === selfId)

  // Unsquares the images by maintaining the aspect ratio no matter device size
  let imageWidth = WIDTH
  const heightProperties = getHeight(photo.metadata, imageWidth)
  const imageHeight = heightProperties.height

  return {
    peerId: photo.author_id,
    dateString,
    defaultSource,
    didLike,
    isLiked,
    totalLikes,
    imageHeight,
    imageWidth,
    username
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPhotoLike: (photoBlockId) => { dispatch(UIActions.addLikeRequest(photoBlockId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetailCard)
