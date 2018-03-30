/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import Dropzone from 'react-dropzone';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import {SelectOption} from '../../types/items';
import SingleSelectComponent from '../SingleSelectComponent';
import {UpdateImportMeterAction} from '../../types/redux/admin';
import { fileProcessingApi } from '../../utils/api';

interface AddReadingProps {
	selectedImportMeter: SelectOption | null;
	meters: SelectOption[];
	updateSelectedImportMeter(meterID: number): UpdateImportMeterAction;
}

export default class AddReadingComponent extends React.Component<AddReadingProps, {}> {
	constructor(props: AddReadingProps) {
		super(props);
		this.handleFileToImport = this.handleFileToImport.bind(this);
	}

	public handleFileToImport(files: File[]) {
		if (!this.props.selectedImportMeter) {
			showErrorNotification('Please select a meter');
		} else {
			const file = files[0];
			fileProcessingApi.submitNewReadings(this.props.selectedImportMeter.value, file)
				.then(() => {
					showSuccessNotification('Successfully uploaded meter data');
				})
				.catch(() => {
					showErrorNotification('Error uploading meter data');
				});
		}
	}

	public render() {
		const titleStyle: React.CSSProperties = {
			fontWeight: 'bold',
			margin: 0,
			paddingBottom: '5px'
		};
		const smallMarginBottomStyle: React.CSSProperties = {
			marginBottom: '5px'
		};

		return (
			<div>
				<p style={titleStyle}>Import readings for a selected meter:</p>
				<SingleSelectComponent
					style={smallMarginBottomStyle}
					options={this.props.meters}
					selectedOption={this.props.selectedImportMeter}
					placeholder='Select meter to import data'
					onValueChange={s => this.props.updateSelectedImportMeter(s.value)}
				/>
				{this.props.selectedImportMeter &&
				<Dropzone accept='text/csv, application/vnd.ms-excel,' onDrop={this.handleFileToImport}>
					<div>Upload readings (CSV):</div>
				</Dropzone>
				}
			</div>
		);
	}
}