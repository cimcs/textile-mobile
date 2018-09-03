import React from 'react'
import { View, Text } from 'react-native'

import moment from 'moment'
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'

const CommentCard = props => {
  // const { userName, comment, date, subComments, isSubComment, photo } = props
  const comment = props.photo.caption
  const date = moment.utc(props.photo.date).fromNow()
  const subComments = undefined
  const isSubComment = false

  const username = props.photo.username ? props.photo.username : props.photo.author_id.substring(0, 8).toUpperCase()
  const defaultSource = require('../../views/Settings/statics/main-image.png')
  const uri = props.photo.author_id ? 'https://cafe.us-east-1.textile.io/ipns/' + props.photo.author_id + '/avatar' : undefined

  return (
    <View style={[ styles.comment, isSubComment ? styles.subComment : styles.withDivider ]}>
      <Avatar style={{ marginRight: 11 }} width={38} height={38} uri={uri} defaultSource={defaultSource} />
      <View style={styles.commentTexts}>
        <Text style={styles.commentUser}>{username}</Text>
        <View style={styles.commentTextWrapper}><Text style={styles.commentText}>{comment}</Text></View>
        {/* <SmallIconTag textStyle={styles.commentIconLabel} image={require('./statics/icon-comment.png')} text='Reply comment' /> */}
        { subComments && subComments.map((subComment, i) => (
          <CommentCard key={i} isSubComment {...subComment} />
        ))}
      </View>
      { !isSubComment && <Text style={styles.commentDate}>{date}</Text> }
    </View>
  )
}

export default CommentCard
