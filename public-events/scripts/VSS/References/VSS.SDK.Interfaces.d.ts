/// <reference path='VSS-Common.d.ts' />
/// <reference path='VSS.WebPlatform.Interfaces.d.ts' />
/// <reference path='../SDK.Interfaces.d.ts' />

//----------------------------------------------------------
// Common interfaces specific to WebPlatform area
//----------------------------------------------------------

/**
* Interface for a single XDM channel
*/
interface IXDMChannel {

    /**
    * Post a message to the other side of the XDM channel
    *
    * @param method Name of the method to invoke
    * @param params Arguments to the method to invoke
    * @return promise completed if/when the other endpoint replies
    */
    postMessage<T>(method: string, params?: any[]): IPromise<T>;

    /**
    * Get the object registry to handle messages from this specific channel.
    * Upon receiving a message, this channel registry will be used first, then
    * the global registry will be used if no handler is found here.
    */
    getObjectRegistry(): IXDMObjectRegistry;
}

/**
* Registry of XDM channels kept per target frame/window
*/
interface IXDMChannelManager {

    /**
    * Add an XDM channel for the given target window/iframe
    *
    * @param window Target iframe window to communicate with
    * @param targetOrigin Url of the target iframe (if known)
    */
    addChannel(window: Window, targetOrigin?: string): IXDMChannel;

    /**
    * Broadcast a message to all channels managed by this channel manager
    *
    * @param method Name of the method to invoke
    * @param params Arguments to the method to invoke
    * @param success Callback method to invoke when the remote procedure succeeds
    * @param error Callback method to invoke when the remote procedure fails
    */
    broadcastMessage(method: string, params?: any[]);
}

/**
* Registry of XDM objects that can be invoked by an XDM channel
*/
interface IXDMObjectRegistry {

    /**
    * Register an object so that its methods can be invoked in an XDM channel
    *
    * @param obj object to register. This object should have functions on it that can be invoked remotely
    * @param name Unique name of the object to register.
    */
    register(obj: any, name: string);
}

/**
* Data passed from the host to an extension frame via the initial handshake
*/
interface IHostHandshakeData {
    pageContext: PageContext;
    initialConfig?: any;
    appContext: IExtensionContext;
}

/**
* Data passed to the host from an extension frame via the initial handshake
*/
interface IAppHandshakeData {
    notifyLoadSucceeded: boolean;
}

/**
* Information about a control interface that is exposed across iframe boundaries
*/
interface IExternalControlInterfaceInfo {
    methodNames: string[];
}

/**
* Context about the app that owns the content that is being hosted
*/
interface IExtensionContext {
    id: string;
    name: string;
    namespace: string;
    version: string;
    baseUri: string;
}

/**
* Session token whose value can be added to the Authorization header in requests to VSO endpoints
*/
interface ISessionToken {
    appId: string;
    name: string;
    token: string;
}


/**
* Information about an individual contribution
*/
interface IContribution {

    /**
    * Id of the contribution (id property)
    */
    id: string;

    /**
    * Unique id of the extension that is contributing this contribution
    */
    extensionId: string;

    /**
    * Full contribution point id
    */
    pointId: string;

    /**
    * Contribution properties lookup
    */
    properties?: IDictionaryStringTo<any>;
}

/**
* Information about an individual contribution that contributes one or more services registered by id.
*/
interface IServiceContribution extends IContribution {
    
    /**
    * Get the instance of an object registered by this contribution
    *
    * @param objectId Id of the registered object (defaults to the id property of the contribution)
    * @param context Optional context to use when getting the object.
    */
    getInstance: <T>(objectId?: string, context?: any) => IPromise<T>;
}

interface IHostDialogOptions {

    height?: number;
    width?: number;
    draggable?: boolean;
    resizable?: boolean;
    title?: string;
    modal?: boolean;
    buttons?: IDictionaryStringTo<any>;
    open?: Function;
    close?: Function;
    getDialogResult?: () => any;
    okCallback?: (result: any) => void;
    cancelCallback?: Function;
    okText?: string;
    cancelText?: string;
}

interface IExternalDialog {
    
    /**
    * Gets an object registered in the dialog's contribution control.
    *
    * @param instanceId Id of the instance to get
    * @param contextData Optional data to pass to the extension for it to use when creating the instance
    * @return Promise that is resolved to the instance (a proxy object that talks to the instance)
    */
    getContributionInstance<T>(instanceId: string, contextData?: any): IPromise<T>;

    /**
    * Close the dialog
    */
    close();

    /**
    * Update the title of the dialog
    *
    * @param title New dialog title
    */
    setTitle(title: string);

    /**
    * Update the enablement of the OK button
    */
    updateOkButton(enabled: boolean);
}

/**
* Service which manages showing dialogs in the parent frame
*/
interface IHostDialogService {
    
    /**
    * Open a modal dialog in the host frame which will get its content from a contributed control.
    * 
    * @param contribution url for dialog contents
    * @param dialogOptions options.title - title of dialog
    * @param contributionConfig Initial configuration to pass to the contribution control.
    * @param postContent Optional data to post to the contribution endpoint. If not specified, a GET request will be performed.
    */
    openDialog(contribution: IContribution, dialogOptions: IHostDialogOptions, contributionConfig?: Object, postContent?: Object): IPromise<IExternalDialog>;
}