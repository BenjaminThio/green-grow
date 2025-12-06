import { faWindows, faLinux, faApple, faAndroid } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dropdown from './dropdown';

export default function DropdownPage() {
    return (
        <div className='min-h-screen bg-black flex font-mono text-sm'>
            <div className='w-[50vw] flex flex-col items-center justify-center'>
                <select className='px-3 py-2 rounded-xl border-none h-fit bg-white'>
                    <option>Hello World</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </div>
            <div className='flex-1 flex flex-col items-center gap-24 pt-2'>
                <Dropdown direction={0} options={[
                    {option: 'Hello World', value: 0},
                    {option: '2', value: 1},
                    {option: '3', value: 2}
                ]}/>
                <Dropdown direction={1} options={[
                    {option: 'Ben', value: 0},
                    {option: 'Teh', value: 1},
                    {option: 'Thye', value: 2}
                ]}/>
                <Dropdown direction={1} options={[
                    {option: <FontAwesomeIcon icon={faWindows} fixedWidth/>, value: 0},
                    {option: <FontAwesomeIcon icon={faLinux} fixedWidth/>, value: 1},
                    {option: <FontAwesomeIcon icon={faApple} fixedWidth/>, value: 2},
                    {option: <FontAwesomeIcon icon={faAndroid} fixedWidth/>, value: 3}
                ]}/>
                <Dropdown multiple direction={1} options={[
                    {option: <FontAwesomeIcon icon={faWindows} fixedWidth/>, value: 0},
                    {option: <FontAwesomeIcon icon={faLinux} fixedWidth/>, value: 1},
                    {option: <FontAwesomeIcon icon={faApple} fixedWidth/>, value: 2},
                    {option: <FontAwesomeIcon icon={faAndroid} fixedWidth/>, value: 3}
                ]}/>
                <Dropdown style={{
                    whole: {
                        color: 'white'
                    },
                    backgroundColor: 'transparent',
                    border: '1px solid purple',
                    option: {
                        border: '1px solid purple'
                    }
                }} multiple direction={0} options={[
                    {option: <FontAwesomeIcon icon={faWindows} fixedWidth/>, value: 0},
                    {option: <FontAwesomeIcon icon={faLinux} fixedWidth/>, value: 1},
                    {option: <FontAwesomeIcon icon={faApple} fixedWidth/>, value: 2},
                    {option: <FontAwesomeIcon icon={faAndroid} fixedWidth/>, value: 3}
                ]}/>
            </div>
        </div>
    );
}