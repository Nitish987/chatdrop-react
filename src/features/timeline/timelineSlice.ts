import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {TimelineFeedModel} from '../../models/feed';
import PostModel from '../../models/post';


interface TimelineState {
  timeline: TimelineFeedModel | null;
}

const initialState: TimelineState = {
  timeline: null,
}

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    setTimelineFeeds: (state, action: PayloadAction<TimelineFeedModel | null>) => {
      state.timeline = action.payload;
    },
    appendTimelineFeeds: (state, action: PayloadAction<TimelineFeedModel | null>) => {
      if (state.timeline !== null && action.payload !== null) {
        state.timeline.posts = state.timeline.posts.concat(action.payload.posts);
        state.timeline.hasNext = action.payload.hasNext;
      }
    },
    addNewPostedTimelineFeed: (state, action: PayloadAction<PostModel>) => {
      if (state.timeline !== null && action.payload !== null) {
        state.timeline.posts.unshift(action.payload);
      }
    },
    changePostVisibility: (state, action: PayloadAction<{ index: number, visibility: string }>) => {
      if (state.timeline !== null) {
        const index = action.payload.index;
        state.timeline.posts[index].visibility = action.payload.visibility;
      }
    },
    likePostFeed: (state, action: PayloadAction<{ index: number, liked: string | null }>) => {
      if (state.timeline !== null) {
        const index = action.payload.index;
        if (action.payload.liked === null) {
          state.timeline.posts[index].likes_count -= 1;
        } else if (state.timeline.posts[index].liked === null) {
          state.timeline.posts[index].likes_count += 1;
        }
        state.timeline.posts[index].liked = action.payload.liked;
      }
    },
    setPostCommentCount: (state, action: PayloadAction<{ index: number, count: number }>) => {
      if (state.timeline !== null) {
        const index = action.payload.index;
        state.timeline.posts[index].comments_count = action.payload.count;
      }
    },
    deletePostFeed: (state, action: PayloadAction<{ index: number }>) => {
      if (state.timeline !== null) {
        const index = action.payload.index;
        delete state.timeline.posts[index];
      }
    },
  },
})

export const {
  setTimelineFeeds,
  appendTimelineFeeds,
  addNewPostedTimelineFeed,
  changePostVisibility,
  likePostFeed,
  setPostCommentCount,
  deletePostFeed,
} = timelineSlice.actions

export default timelineSlice.reducer