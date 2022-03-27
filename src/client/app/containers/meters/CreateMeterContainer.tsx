/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import store from '../../index';
import HeaderContainer from '../HeaderContainer';
import FooterContainer from '../FooterContainer';
import CreateMeterComponent from '../../components/meters/CreateMeterComponent';
import { metersApi } from '../../utils/api';
import { browserHistory } from '../../utils/history';
import { showSuccessNotification, showErrorNotification } from '../../utils/notifications';
import translate from '../../utils/translate';
import { GPSPoint, isValidGPSInput } from '../../utils/calibration';
import { removeUnsavedChanges, updateUnsavedChanges } from '../../actions/unsavedWarning';
import UnsavedWarningContainer from '../../containers/UnsavedWarningContainer';
import { MeterTypes } from '../../types/items';


export default class CreateUserFormContainer extends React.Component<{}, {}>{
	constructor(props: {}) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
		this.handleEnabledChange = this.handleEnabledChange.bind(this);
		this.handleDisplayableChange = this.handleDisplayableChange.bind(this);
		this.handleIpAddressChange = this.handleIpAddressChange.bind(this);
		this.handleMeterTypeChange = this.handleMeterTypeChange.bind(this);
		this.handleGPSChange = this.handleGPSChange.bind(this);
		this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
		this.submitNewMeter = this.submitNewMeter.bind(this);
		this.handleSubmitClicked = this.handleSubmitClicked.bind(this);
	}

	state = {
		name: '',
		identifier: '',
		enabled: false,
		displayable: false,
		meterType: MeterTypes.OTHER,
		ipAddress: '',
		gps: undefined,
		editedGPS: '',
		timeZone: ''
	}
	private removeUnsavedChangesFunction = (callback: () => void) => {
		// This function is called to reset all the inputs to the initial state
		// Do not need to do anything since unsaved changes will be removed after leaving this page
		callback();
	}
	private updateUnsavedChanges() {
		// Notify that there are unsaved changes
		store.dispatch(updateUnsavedChanges(this.removeUnsavedChangesFunction, this.submitNewMeter));
	}

	private removeUnsavedChanges() {
		// Notify that there are no unsaved changes
		store.dispatch(removeUnsavedChanges());
	}

	private handleNameChange = (newName: string) => {
		this.setState({ name: newName })
		this.updateUnsavedChanges();
	}
	private handleIdentifierChange = (newIdentifier: string) => {
		this.setState({ identifier: newIdentifier })
		if (this.state.name === '') {
			this.setState({ name: newIdentifier })
		}
		this.updateUnsavedChanges();
	}
	private handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		this.setState({ enabled: e.currentTarget.value === 'true' })
		this.updateUnsavedChanges();
	}
	private handleDisplayableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ displayable: e.target.value === 'true' })
		this.updateUnsavedChanges();
	}
	private handleMeterTypeChange = (newType: MeterTypes) => {
		this.setState({ meterType: newType })
		this.updateUnsavedChanges();
	}
	private handleIpAddressChange = (newIpAdd: string) => {
		this.setState({ ipAddress: newIpAdd })
		this.updateUnsavedChanges();
	}
	private handleTimeZoneChange = (newTimeZone: string) => {
		this.setState({ timeZone: newTimeZone })
		this.updateUnsavedChanges();
	}
	private handleEditingGPS = (newGPS: string) => {
		this.setState({ editedGPS: newGPS })
	}
	private handleGPSChange = () => {
		// The callback is used for displaying unsaved warning.
		const gpsProxy = this.state.editedGPS.replace('(', '').replace(')', '').replace(' ', '');
		if (this.state.editedGPS === '' || isValidGPSInput(gpsProxy)) {
			if (this.state.editedGPS !== '') {
				// if it satisfies if condition, and defined, then set GPSPoint
				const parseGPS = gpsProxy.split(',');
				// should only have 1 comma
				const gPoint: GPSPoint = {
					longitude: parseFloat(parseGPS[1]),
					latitude: parseFloat(parseGPS[0])
				};
				this.setState({ gps: gPoint })
			}
		}
		this.updateUnsavedChanges();
	}
	private handleSubmitClicked() {
		this.submitNewMeter();
	}
	private submitNewMeter = async () => {
		this.setState({ submittedOnce: true })
		this.handleGPSChange();
		this.removeUnsavedChanges();
		try {
			await metersApi.create({
				id: -1,
				name: this.state.name,
				identifier: this.state.identifier,
				enabled: this.state.enabled,
				displayable: this.state.displayable,
				meterType: this.state.meterType,
				ipAddress: this.state.ipAddress,
				gps: this.state.gps,
				timeZone: this.state.timeZone
			});
			showSuccessNotification(translate('meter.successfully.create.meter'))
			browserHistory.push('/meters');

		} catch (error) {
			showErrorNotification(translate('failed.to.create.meter'));
		}
	}
	public render() {
		return (
			<div>
				<UnsavedWarningContainer />
				<HeaderContainer />
				{/* pass required state to trigger the changes */}
				<CreateMeterComponent
					name={this.state.name}
					identifier={this.state.identifier}
					enabled={this.state.enabled}
					displayable={this.state.displayable}
					ipAddress={this.state.ipAddress}
					gps={this.state.gps}
					timeZone={this.state.timeZone}
					meterType={this.state.meterType}
					handleEnabledChange={this.handleEnabledChange}
					handleDisplayableChange={this.handleDisplayableChange}
					handleNameChange={this.handleNameChange}
					handleIdentifierChange={this.handleIdentifierChange}
					handleIpAddressChange={this.handleIpAddressChange}
					handleMeterTypeChange={this.handleMeterTypeChange}
					handleTimeZoneChange={this.handleTimeZoneChange}
					handleEditingGPS={this.handleEditingGPS}
					submitNewMeter={this.submitNewMeter}
				/>
				<FooterContainer />
			</div>
		)
	}
}