import React, { useRef } from 'react';
import '../styles/ReelBlock.css'
import { useAppSelector } from '../../../redux/hooks';
import ReelPlaceholder from '../../../shared/components/ReelPlaceholder';
import PrimaryIconButton from '../../../shared/ui/PrimaryIconButton';
import Icons from '../../../settings/constants/icons';

export default function ReelBlock() {
  const reelline = useAppSelector(state => state.reelline.reelline);
  const reelBlockDiv = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (reelBlockDiv.current) {
      reelBlockDiv.current.scrollLeft -= 300;
    }
  }

  const scrollRight = () => {
    if (reelBlockDiv.current) {
      reelBlockDiv.current.scrollLeft += 300;
    }
  }

  return (
    <div className='reel-block'>
      {
        reelline &&
        <div className="reel-horizontal" ref={reelBlockDiv}>
          {
            reelline.reels.map((reel, index) => {
              return <ReelPlaceholder key={reel.id} index={index} name={reel.user.name} thumbnail={reel.video!.thumbnail!} views={reel.views_count} />
            })
          }
          <div className='reel-scroll-prev-btn'>
            <PrimaryIconButton icon={Icons.arrowBack} label='reel_previous' onClick={scrollLeft} />
          </div>
          <div className='reel-scroll-next-btn'>
            <PrimaryIconButton icon={Icons.arrowForward} label='reel_next' onClick={scrollRight} />
          </div>
        </div>
      }
    </div>
  )
}
