import React, {Component} from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'

import KeyboardResponsiveContainer from '../Components/KeyboardResponsiveContainer'
import CommentCard, { Props as CommentCardProps } from '../SB/components/CommentCard'
import CommentBox from '../SB/components/CommentBox/CommentBox'

import ProgressiveImage from '../Components/ProgressiveImage'

import styles from './Styles/CommentsStyle'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { RootState, RootAction } from '../Redux/Types'

interface StateProps {
  captionCommentCardProps?: CommentCardProps
  commentCardProps: CommentCardProps[]
  commentValue: string | undefined
}

interface DispatchProps {
  updateComment: (comment: string) => void
  submitComment: () => void
}

type Props = StateProps & DispatchProps

class Comments extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        {/* tslint:disable-next-line jsx-no-lambda */}
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Comments',
      tabBarVisible: false
    }
  }

  scrollView?: ScrollView

  scrollToEnd = () => {
    if (this.scrollView) {
      this.scrollView.scrollToEnd()
    }
  }

  componentDidUpdate (previousProps: Props, previousState: State) {
    if (this.props.commentCardProps.length > previousProps.commentCardProps.length) {
      // New comment added, scroll down, need timeout to allow rendering
      setTimeout(this.scrollToEnd, 100)
    }
  }

  render () {
    return (
      <KeyboardResponsiveContainer style={styles.container} >
        {this.props.captionCommentCardProps &&
          <CommentCard {...this.props.captionCommentCardProps} />
        }
        <ScrollView ref={(ref) => this.scrollView = ref ? ref : undefined} style={styles.contentContainer}>
          <View>
            {this.props.commentCardProps.map((commentCardProps, i) => (
              <CommentCard key={i} {...commentCardProps} />
            ))}
          </View>
        </ScrollView>
        <CommentBox onUpdate={this.props.updateComment} onSubmit={this.props.submitComment} value={this.props.commentValue} />
      </KeyboardResponsiveContainer>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {
  const { viewingPhoto } = state.photoViewing
  if (!viewingPhoto) {
    throw new Error('no viewing thread or photo')
  }

  let captionCommentCardProps: CommentCardProps | undefined
  if (viewingPhoto.caption) {
    captionCommentCardProps = {
      username: viewingPhoto.username || viewingPhoto.author_id,
      peerId: viewingPhoto.author_id,
      comment: viewingPhoto.caption,
      date: viewingPhoto.date,
      isCaption: true
    }
  }
  // TODO: comments should always be defined: https://github.com/textileio/textile-go/issues/270
  const comments = viewingPhoto.comments || []
  const commentCardProps = comments.slice().reverse().map((comment) => {
    const props: CommentCardProps = {
      username: comment.username || 'unknown',
      peerId: comment.author_id,
      comment: comment.body,
      date: comment.date,
      isCaption: false
    }
    return props
  })
  return {
    captionCommentCardProps,
    commentCardProps,
    commentValue : state.photoViewing.authoringComment
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: Props): DispatchProps => ({
  updateComment: (comment: string) => dispatch(PhotoViewingActions.updateComment(comment)),
  submitComment: () => dispatch(PhotoViewingActions.addCommentRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(Comments)
