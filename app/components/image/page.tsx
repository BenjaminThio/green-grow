import { type JSX } from 'react';
import styles from './page.module.css';
import Image2Base64Component from './image-to-base64';

export default function ImagePage(): JSX.Element {
    return (
        <div className={styles['main-container']}>
            <Image2Base64Component/>
        </div>
    );
}