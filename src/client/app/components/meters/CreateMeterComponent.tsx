/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { Button, Input } from 'reactstrap';
import TimeZoneSelect from '../TimeZoneSelect';
import { FormattedMessage } from 'react-intl';
import { GPSPoint } from 'utils/calibration';
import { MeterTypes } from '../../types/items';

interface CreateMeterFormProps {
	name: string,
	identifier: string;
	meterType: string;
	ipAddress: string;
	enabled: boolean;
	displayable: boolean;
	gps?: GPSPoint;
	timeZone: string;
	handleNameChange: (val: string) => void;
	handleIdentifierChange: (val: string) => void;
	handleMeterTypeChange: (val: MeterTypes) => void;
	handleIpAddressChange: (val: string) => void;
	handleEnabledChange: (val: React.ChangeEvent<HTMLInputElement>) => void;
	handleDisplayableChange: (val: React.ChangeEvent<HTMLInputElement>) => void;
	handleEditingGPS: (val: string) => void;
	handleTimeZoneChange: (val: string) => void;
	submitNewMeter: () => void;
}

export default class CreateMeterFormComponent extends React.Component<CreateMeterFormProps, {}> {
	constructor(props: CreateMeterFormProps) {
		super(props);
	}

	public render() {
		const formInputStyle: React.CSSProperties = {
			paddingBottom: '5px'
		}
		const titleStyle: React.CSSProperties = {
			textAlign: 'center'
		};

		const tableStyle: React.CSSProperties = {
			marginLeft: '25%',
			marginRight: '25%',
			width: '50%'
		};
		return (
			<div className='container-fluid'>
				<h1 style={titleStyle}> <FormattedMessage id='create.meter' /> </h1>
				<div style={tableStyle}>
					<form onSubmit={e => { e.preventDefault(); this.props.submitNewMeter(); }}>
						<div style={formInputStyle}>
							<label> <FormattedMessage id='meter.name' /> </label><br />
							<Input type='text' onChange={({ target }) => this.props.handleNameChange(target.value)} required value={this.props.name} />
						</div>
						<div style={formInputStyle}>
							<label> <FormattedMessage id='meter.identifier' /></label><br />
							<Input type='text' onChange={({ target }) => this.props.handleIdentifierChange(target.value)} required value={this.props.identifier} />
						</div>
						<div style={formInputStyle}>
							<label>  <FormattedMessage id='meter.type' /></label><br />
							<Input type='select' onChange={({ target }) => this.props.handleMeterTypeChange(target.value as MeterTypes)} value={this.props.meterType}>
								{Object.entries(MeterTypes).map(([key, val]) => (
									<option value={val} key={val}> {key} </option>
								))}
							</Input>
						</div>
						<div style={formInputStyle}>
							<label> <FormattedMessage id='meter.ip' /></label><br />
							<Input type='text' onChange={({ target }) => this.props.handleIpAddressChange(target.value)} />
						</div>

						<div style={formInputStyle}>
							<label> <FormattedMessage id='meter.gps' /></label><br />
							<Input type='text' onChange={({ target }) => this.props.handleEditingGPS(target.value)} />
						</div>

						<div style={formInputStyle}>
							<label> <FormattedMessage id='enable' /> </label><br />
							<Input type='select' name='enabledselect' onChange={this.props.handleEnabledChange} required>
								<option value='' selected disabled hidden>
									Select
								</option>
								<option value='true'>
									True
								</option>
								<option value='false'>
									False
								</option>
							</Input>
						</div>
						<div style={formInputStyle}>
							<label> <FormattedMessage id='displayable' /> </label><br />
							<Input type='select' name='displayselect' onChange={this.props.handleDisplayableChange} required>
								<option value='' selected disabled hidden>
									Select
								</option>
								<option value='true'>
									True
								</option>
								<option value='false'>
									False
								</option>
							</Input>
						</div>
						<div>
							<label> <FormattedMessage id='meter.time.zone' /> </label><br />
							<TimeZoneSelect current={this.props.timeZone || ''} handleClick={this.props.handleTimeZoneChange} />
						</div>
						<div>
							<Button> <FormattedMessage id='submit.new.meter' /> </Button>
						</div>
					</form>
				</div>
			</div>
		)
	}
}