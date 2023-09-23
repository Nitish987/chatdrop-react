import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReellineFeedModel } from '../../models/feed';
import ReelModel from '../../models/reel';


interface ReellineState {
  reelline: ReellineFeedModel | null;
}

const initialState: ReellineState = {
  reelline: null,
}

export const reellineSlice = createSlice({
  name: 'reelline',
  initialState,
  reducers: {
    setReellineFeeds: (state, action: PayloadAction<ReellineFeedModel | null>) => {
      state.reelline = action.payload;
    },
    appendReellineFeeds: (state, action: PayloadAction<ReellineFeedModel | null>) => {
      if (state.reelline !== null && action.payload !== null) {
        state.reelline.reels = state.reelline.reels.concat(action.payload.reels);
        state.reelline.hasNext = action.payload.hasNext;
      }
    },
    addNewPostedReellineFeed: (state, action: PayloadAction<ReelModel>) => {
      if (state.reelline !== null && action.payload !== null) {
        state.reelline.reels.unshift(action.payload);
      }
    },
    changeReelVisibility: (state, action: PayloadAction<{ index: number, visibility: string }>) => {
      if (state.reelline !== null) {
        const index = action.payload.index;
        state.reelline.reels[index].visibility = action.payload.visibility;
      }
    },
    likeReelFeed: (state, action: PayloadAction<{ index: number, liked: string | null }>) => {
      if (state.reelline !== null) {
        const index = action.payload.index;
        if (action.payload.liked === null) {
          state.reelline.reels[index].likes_count -= 1;
        } else if (state.reelline.reels[index].liked === null) {
          state.reelline.reels[index].likes_count += 1;
        }
        state.reelline.reels[index].liked = action.payload.liked;
      }
    },
    setReelCommentCount: (state, action: PayloadAction<{ index: number, count: number }>) => {
      if (state.reelline !== null) {
        const index = action.payload.index;
        state.reelline.reels[index].comments_count = action.payload.count;
      }
    },
    deleteReelFeed: (state, action: PayloadAction<{ index: number }>) => {
      if (state.reelline !== null) {
        const index = action.payload.index;
        delete state.reelline.reels[index];
      }
    },
  },
})

export const {
  setReellineFeeds,
  appendReellineFeeds,
  addNewPostedReellineFeed,
  changeReelVisibility,
  likeReelFeed,
  setReelCommentCount,
  deleteReelFeed
} = reellineSlice.actions

export default reellineSlice.reducer