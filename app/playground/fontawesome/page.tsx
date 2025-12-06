import { type JSX } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCake, faTree, faCircleUser } from '@fortawesome/free-solid-svg-icons';

export default function FontawesomePage(): JSX.Element {
    return (
        <div>
            <FontAwesomeIcon icon={faCake}/>
            <FontAwesomeIcon icon={faTree}/>
            <FontAwesomeIcon icon={faCircleUser}/>
        </div>
    );
}