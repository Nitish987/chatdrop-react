import './Alert.css';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { dismissAlert } from './alertSlice';
import Icons from '../../settings/constants/icons';
import IconButton from '../../shared/ui/IconButton';

export default function Alert() {
  const dispatch = useAppDispatch();
  const alert = useAppSelector(state => state.alert);
  const dismiss = () => dispatch(dismissAlert());

  return (
    <>
      { 
        alert.visible && 
        <div className={`alert ${alert.type}`}>
          <span className='message'>{alert.message}</span>
          <IconButton icon={Icons.close} label='close' applyIconTheme={false} onClick={dismiss}/>
        </div>
      }
    </>
  )
}
