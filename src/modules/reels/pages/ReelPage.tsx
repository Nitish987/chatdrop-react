import React, { useEffect, useState } from 'react';
import '../styles/ReelPage.css';
import IconTextButton from '../../../shared/ui/IconTextButton';
import Icons from '../../../settings/constants/icons';
import User from '../../../shared/components/User';
import { useAppSelector } from '../../../redux/hooks';
import ReelModel from '../../../models/reel';
import Reel from '../../../shared/components/Reel';
import IconButton from '../../../shared/ui/IconButton';
// import ReelPageController from '../controllers/ReelPageController';
// import { showAlert } from '../../../features/alert/alertSlice';
// import { deleteReelFeed } from '../../../features/reelline/reellineSlice';

export default function ReelPage() {
  // const reelController = ReelPageController.getInstance();
  const profile = useAppSelector(state => state.content.profile);
  const reelline = useAppSelector(state => state.reelline.reelline);
  const [reel, setReel] = useState<ReelModel | null>(null);
  const [reelIndex, setReelIndex] = useState(0);

  const nextReel = () => {
    if (reelline && reelIndex < reelline.reels.length) {
      setReel(reelline.reels[reelIndex + 1]);
      setReelIndex(reelIndex + 1);
    }
  }

  const prevReel = () => {
    if (reelline && reelIndex > 0) {
      setReel(reelline.reels[reelIndex - 1]);
      setReelIndex(reelIndex - 1);
    }
  }

  useEffect(() => {
    if (reelline && reel === null) {
      setReel(reelline.reels[reelIndex]);
    }
  }, [reelline, reel, setReel, reelIndex])

  return (
    <div className='reel-page-container'>
      <div className="reel-page-menu">
        {
          profile &&
          <User uid={profile.profile.uid} name={profile.profile.name} photo={profile.profile.photo} gender={profile.profile.gender} message={profile.profile.message} />
        }
        <div className='reel-page-options' data-box="elevated">
          {/* <IconTextButton icon={Icons.add} label='Add Reel' justifyContent='start' showBorder={false} /> */}
          <IconTextButton icon={Icons.reels} label='My Reels' justifyContent='start' showBorder={false} />
        </div>
      </div>
      <div className="reel-page-viewer">
        <div className="reel-page-outlet" data-box="elevated">
          {
            reel && <Reel index={reelIndex} reel={reel} isSameUser={reel.user.uid === reel.auth_user.uid}/>
          }
          <div className="reel-change-btns">
            <IconButton icon={Icons.arrowUp} label='previous' onClick={prevReel} />
            <IconButton icon={Icons.arrowDown} label='next' onClick={nextReel} />
          </div>
        </div>
      </div>
    </div>
  )
}
