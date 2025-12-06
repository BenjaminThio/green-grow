import { type JSX } from 'react';
import styles from './page.module.css';
import { Camel2Title } from '@/utils/string-formatters';
import { type RGB, ColorFormat, colorKeywords, Rgb2Hex, Rgb2Hsl, Stringify } from '@/utils/color';
import Monitor from './monitor';

export default function ComponentShowcasePage() {
    const namedColorTable: JSX.Element[] = [];
    let counter: number = 0;

    let colorCategory: string;
    for (colorCategory in colorKeywords) {
        namedColorTable.push(
        <tr key={counter}>
            <th colSpan={5} style={{fontSize: 'xx-large'}}>{Camel2Title(colorCategory)}</th>
        </tr>, 
        <tr key={counter + 1}>
            <th style={{fontSize: 'large'}}>Keyword</th>
            <th style={{fontSize: 'large'}}>RGB</th>
            <th style={{fontSize: 'large'}}>Hex</th>
            <th style={{fontSize: 'large'}}>HSL</th>
            <th style={{fontSize: 'large'}}>Color</th>
        </tr>
        );
        counter += 2;

        let colorKeyword: string;
        for (colorKeyword in colorKeywords[colorCategory]) {
            const rgb: RGB = colorKeywords[colorCategory][colorKeyword];

            namedColorTable.push(
                <tr key={counter}>
                    <td>
                        <span className={styles.highlight}>
                            {colorKeyword}
                        </span>
                    </td>
                    <td>
                        <span>
                            {Stringify(rgb, ColorFormat.Rgb)}
                        </span>
                    </td>
                    <td>
                        <span>
                            {Rgb2Hex(rgb)}
                        </span>
                    </td>
                    <td>
                        <span>
                            {Stringify(Rgb2Hsl(rgb), ColorFormat.Hsl)}
                        </span>
                    </td>
                    <td>
                        <div style={{backgroundColor: colorKeyword}} className={styles.palette}/>
                    </td>
                </tr>
            );
            counter += 1;
        }
    }
    
    return (
    <div className={`${styles['main-container']}`} style={{fontFamily: 'monospace', color: 'white', backgroundColor: '#131314'}}>
        <span className={styles['left-inner-container']}>
            <table className={styles['named-color-table']}>
                <tbody>
                    {namedColorTable}
                </tbody>
            </table>
        </span>
        <span className={styles['right-inner-container']}>
            <Monitor/>
        </span>
    </div>
    );
};