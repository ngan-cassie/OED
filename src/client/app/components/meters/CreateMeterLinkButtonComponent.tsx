/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

interface CreateMeterLinkButtonComponentProps {
	style?: React.CSSProperties;
}

export default function CreateMeterLinkButtonComponent(props: CreateMeterLinkButtonComponentProps) {
	const buttonContainerStyle: React.CSSProperties = {
		minWidth: '150px',
		width: '10%',
		marginLeft: '40%',
		marginRight: '40%'
	};

	return (
		<Link style={buttonContainerStyle} to='/meters/new'>
			<Button color='primary'>
				<FormattedMessage id='create.meter' />
			</Button>
		</Link>
	)
}