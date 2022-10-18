/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
<<<<<<< HEAD
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
=======
 *  Licensed under the MIT License. See License.txt in the project root for license information.
>>>>>>> dbd465b085bab33005a12c52e2c04fc7fea29923
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from 'vs/platform/instantiation/common/instantiation';
import { IExtensionHostExitInfo } from 'vs/workbench/services/remote/common/remoteAgentService';

export const IExtensionHostStatusService = createDecorator<IExtensionHostStatusService>('extensionHostStatusService');

export interface IExtensionHostStatusService {
	readonly _serviceBrand: undefined;

	setExitInfo(reconnectionToken: string, info: IExtensionHostExitInfo): void;
	getExitInfo(reconnectionToken: string): IExtensionHostExitInfo | null;
}

export class ExtensionHostStatusService implements IExtensionHostStatusService {
	_serviceBrand: undefined;

	private readonly _exitInfo = new Map<string, IExtensionHostExitInfo>();

	setExitInfo(reconnectionToken: string, info: IExtensionHostExitInfo): void {
		this._exitInfo.set(reconnectionToken, info);
	}

	getExitInfo(reconnectionToken: string): IExtensionHostExitInfo | null {
		return this._exitInfo.get(reconnectionToken) || null;
	}
}
