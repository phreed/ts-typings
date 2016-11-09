// Type definitions for webgme
// Project: https://webgme.org
// Definitions by: Fred Eisele <https://github.com/phreed>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

// Based on examination of
// Example: https://github.com/typed-typings/env-node/blob/master/0.12/node.d.ts
// Source: https://raw.githubusercontent.com/phreed/typed-npm-webgme/master/webgme.d.ts
// Documentation: https://editor.webgme.org/docs/source/index.html

declare module "blob/BlobMetadata" {
    export default class BlobMetadata implements Blobs.BlobMetadata {
        constructor();
        name: string;
        size: number;
        mime: string;
        context: Common.DataObject;
        contentType: string;
    }
}

declare module "plugin/PluginBase" {
    export = Core.PluginBase;
}

declare module "plugin/PluginConfig" {
    export = Config.PluginConfig;
}

declare module "webgme/config/config.default" {
    export = Config.config;
}

declare module "webgme/common" {
    export = Common;
}

declare module "common/util/canon" {
    export = Util.CANON;
}

declare module "common/util/assert" {
    export = Util.ASSERT;
}

declare module "js/PanelBase/PanelBase" {
    export = Panel.PanelBase;
}

declare module "js/PanelBase/PanelBaseWithHeader" {
    export = Panel.PanelBaseWithHeader;
}

declare module "js/PanelManager/IActivePanel" {
    export = Panel.IActivePanel;
}

declare module "js/NodePropertyNames" {
    var names: GME.NodePropertyNames;
    export = names;
}

declare module "js/RegistryKeys" {
    const keys: GME.RegistryKeys;
    export = keys;
}

declare module "js/Utils/GMEConcepts" {
    export = GME.Concepts;
}

declare module "js/Utils/PreferencesHelper" {
    const helper: GME.PreferenceHelper;
    export = helper;
}

declare interface Dictionary<T> {
    [key: string]: T;
}

declare namespace GME {

    interface NodePropertyNames {
        Attributes: {
            name: string;
        };
    }
    interface RegistryKeys {
        POSITION: string;
    }
    interface PreferenceHelper {
        getPreferences(): PreferenceHelper;
    }
    export namespace Concepts {
        function isConnection(node: Common.Node): boolean;

        interface ConnectionStyle {
            startArrow: string;
            endArrow: string;
        }

        interface ComposeChain {
            objId: string;
            subCompId: undefined | string;
        }

        interface ConnectionCollectionPair {
            sources: ComposeChain[];
            destinations: ComposeChain[];
        }
    }
    interface ConnectionCallback {
        (err: Error, connection: any): void;
    }
    interface Project {
        name: string;
        /** should always be true */
        read: boolean;
        write: boolean;
        delete: boolean;
        branches: {
            [key: string]: string;
        }
    }
    interface ProjectCallback {
        (err: Error, projects: Project[] | { [key: string]: Project }): void;
    }
    interface OpenProjectCallback {
        (err: Error, commit: any): void;
    }

    interface Pos2D {
        x: number;
        y: number;
    }
    interface VisualizerControl {

    }
    interface ObjectDescriptor {
        id: string;
        name: string;
        childrenIds: string[];
        parentId: string;
        isConnection: boolean;
        childrenNum: number;
        position: number;
        source: string;
        target: string;
        pointers: Dictionary<Common.Pointer>;
        srcPos: Pos2D;
        dstPos: Pos2D;
        srcObjId: string;
        dstObjId: string;

        control?: VisualizerControl;
        metaInfo?: Dictionary<string>;
        preferencesHelper?: GME.PreferenceHelper;
        srcSubCompId?: string;
        dstSubCompId?: string;
        reconnectable?: boolean;
        editable?: boolean;
    }
    /**
     * May be: 'load' 'update' 'unload'
     */
    export type TerritoryEventType = "load" | "unload" | "update";

    interface Event {
        id?: string;
        etype: TerritoryEventType;
        eid: string;
        desc?: ObjectDescriptor;
    }
    /**
     * The eventHandler is invoked whenever there are 
     * changes to the nodes matching any of the patterns.
     *  There are three cases when it is triggered:
     *   - updateTerritory was invoked by us.
     *   - Another client made changes to nodes within the territory.
     *   - We made changes to any of the nodes (via the setters).
     * 
     *  * ('load')
     * The node is loaded and we have access to it.
     * It was either just created or this is the initial updateTerritory we invoked.
     *  * ('update') 
     * There were changes to the node (some might not apply to your application).
     * The node is still loaded and we have access to it.
     *  * ('unload')
     * The node was removed from the model (we can no longer access it).
     * We still get the path/id via events[i].eid
     *  * (else)
     * "Technical events" not used.
     */
    interface TerritoryEventHandler {
        (event: Event[]): void;
    }
    interface ChildCreationParams {
        parentId: string;
        baseId: string;
    }
    interface TransactionResult {
        hash: string;
        /**
         * may be: 'SYNCED' or 'FORKED'
         */
        status: string;
    }
    interface TransactionCallback {
        (err: Error, result: TransactionResult): void;
    }
    interface AttributeSchema {
        /** integer, float, asset, string */
        type: string;
        /** array of possible/allowed values */
        enum: string[];
    }
    interface ChildType {
        /**
         * The id of the loaded new child type
         */
        id: string;
        /**
         * the minimum necessary amount of this type of child
         */
        min: number;
        /**
         * the maximum allowed children of this type
         */
        max: number;
    }
    interface PointerMeta {
        /**
         * the maximum allowed targets for a pointer is 1.
         * more than 1 requires a set.
         */
        max: number;
        items: { id: string }[];
    }

    type TerritoryId = Common.GUID;
    /**
     * A pattern is a filter for nodes to load/watch.
     * 
     * The root-node (with path '') always exists in a 
     * project so it is the safest starting point. 
     * We specify the number of levels in the containment
     * hierarchy to load.
     * It can be set to any positive integer [0, Inf).
     */
    interface TerritoryPattern {
        children: number;
    }

    /**
     * https://github.com/webgme/webgme/wiki/GME-Client-API
     * 
     * https://github.com/webgme/webgme/blob/master/src/client/js/client.js
     */
    class Client {
        constructor();
        /**
         * Connecting to the webGME database.
         */
        connectToDatabase(callback: ConnectionCallback): void;
        /**
         * asIndexed true to get an object indexed by project ids.
         */
        getProjectsAndBranches(asIndexed: boolean, callback: ProjectCallback): void;
        /**
         * The client opens a project and a branch and 
         * from there we can start registering for node events.
         */
        selectProject(projectId: string, branchName: string, callback: OpenProjectCallback): void;
        /**
         * Add a user associated with the pattern and an event-handler.
         * The eventHandler is invoked whenever there are changes 
         * to the nodes matching any of the patterns.
         * There are three cases when it is triggered:
         * - **updateTerritory** was invoked by us.
         * - Another client made changes to nodes within the territory.
         * - We made changes to any of the nodes (via the setters).
         * 
         * Returns the user-id.
         */
        addUI(pattern: any, eventHandler: TerritoryEventHandler, guid?: TerritoryId): string;
        /**
         * Initiate the initial load of nodes matching the patterns.
         */
        updateTerritory(userId: string, patterns: Dictionary<TerritoryPattern>): void;
        /**
         * When we are no longer interested in the the 
         * nodes for the userId so we remove the user. 
         * This will prevent further invocations of
         * our eventHandler and it will be cleaned up.
         */
        removeUI(userId: string): void;

        /**
         * Typically called from within the event-handler.
         */
        getNode(nodeId: Common.NodeId): Common.Node;
        /**
         * Get an array of all the META nodes as nodeObjs.
         * Since these may change it is a good idea to invoke 
         * this each time the territory of the root changes.
         */
        getAllMetaNodes(): Common.Node[];

        setAttributes(nodeId: Common.NodeId, name: string, newName: string, message: string): void;
        createChild(params: ChildCreationParams, message: string): void;
        delMoreNodes(nodeIds: Common.NodeId[], message: string): void;

        /**
         * Transactions
         */
        startTransaction(message: string): void;
        setRegistry(nodeId: Common.NodeId, attr: string, property: any, message: string): void;
        completeTransaction(message: string, callback: TransactionCallback): void;

        /**
         * make a new pointer object.
         * The source and target should already be loaded.
         */
        makePointer(sourceNodeId: Common.NodeId, pointerName: string, targetNodeId: Common.NodeId, message: string): Common.Pointer;
        /**
        * assign a node to a set
        * The source and target should already be loaded.
        */
        addMember(sourceNodeId: Common.NodeId, targetNodeId: Common.NodeId, setName: string, message: string): Common.Pointer;

        getAllMetaNodes(): Common.Node[];
        setAttributeSchema(nodeId: string, name: string, schema: AttributeSchema): void;
        updateValidChildrenItem(nodeId: Common.NodeId, type: ChildType): void

        setPointerMeta(metaNodeId: Common.NodeId, newPointerName: string, meta: PointerMeta): void;

    }

}
declare const WebGMEGlobal: Global.WebGmeGlobal;

declare namespace Global {
    interface History {
        value: boolean;
        writable: boolean;
        enumerable: boolean;
        configurable: boolean;
    }
    interface WebGmeGlobal {
        gmeConfig: Config.GmeConfig;
        getConfig(): Config.GmeConfig;

        State?: State;
        PanelManager?: Panel.PanelManager;
        KeyboardManager?: KeyboardManager;
        LayoutManager?: Panel.LayoutManager;
        Toolbar?: Toolbar.Toolbar;
        userInfo?: UserInfo;
        history?: History;
        NpmVersion?: string;
        GitHubVersion?: string;
        version?: string;
    }

    class UserInfo {
        _id: string;
    }

    interface StateOptions {
        silent: boolean;
    }
    interface StateHandler {
        (model: any, change: string): void;
    }
    class State {
        set(update: State): void;

        registerActiveBranchName(branchName: string): void;
        registerActiveCommit(activeCommitHash: Common.MetadataHash): void;
        registerActiveVisualizer(vizualizer: Visualize.Visualizer): void;
        registerActiveSelection(selection: string[]): void;
        registerSuppressVisualizerFromNode(register: boolean): void;

        registerActiveObject(nodePath: Common.Path): void;
        getActiveObject(): any;

        registerLayout(layout: Panel.Layout): void;

        clear(options?: StateOptions): void;
        toJSON(): any;

        on(message: string, handler: StateHandler, target: any): void;
        off(message: string, handler: StateHandler): void;
    }
    class KeyboardManager {
        setEnabled(action: boolean): void;
        setListener(listener?: any): void;
    }
}

declare namespace Toolbar {
    interface ToolbarParams {

    }

    class ToolbarItem {
        show(): void;
        hide(): void;
        destroy(): void;

        enabled(value: boolean): void;
    }

    class ToolbarButton extends ToolbarItem {
        constructor();
    }
    class ToolbarSeparator extends ToolbarItem {
        constructor();
    }
    class ToolbarRadioButtonGroup extends ToolbarButton {
        constructor();
    }
    class ToolbarToggleButton extends ToolbarButton {
        constructor();
    }
    class ToolbarTextBox extends ToolbarItem {
        constructor();
    }
    class ToolbarLabel extends ToolbarItem {
        constructor();
    }
    class ToolbarCheckBox extends ToolbarItem {
        constructor();
    }
    class ToolbarDropDownButton extends ToolbarItem {
        constructor();
        addButton(params: ToolbarParams): ToolbarButton;
    }
    class ToolbarColorPicker extends ToolbarItem {
        constructor();
    }
    interface ClickFn {
        (): void;
    }
    class Toolbar {
        constructor(element: Element);
        add(item: ToolbarItem): ToolbarButton;
        addButton(params: ToolbarParams): ToolbarButton;
        addSeparator(): ToolbarSeparator;
        addRadioButtonGroup(clickFn: ClickFn): ToolbarRadioButtonGroup;
        addToggleButton(params: ToolbarParams): ToolbarToggleButton;
        addTextBox(params: ToolbarParams): ToolbarTextBox;
        addLabel(): ToolbarLabel;
        addCheckBox(): ToolbarCheckBox;
        addDropDownButton(params: ToolbarParams): ToolbarDropDownButton;
        addColorPicker(params: ToolbarParams): ToolbarColorPicker;

        refresh(): void;
    }
}

declare namespace Visualize {
    class Visualizer {
    }
}

declare namespace Panel {

    class IActivePanel {
        setActive(isActive: boolean): void;
        onActivate(): void;
        onDeactivate(): void;
        getNodeID(): string;
    }

    class Logger {
        createLogger(name: string, options: Config.LogOptions): Logger;
        createWithGmeConfig(name: string, gmeConfig: Config.GmeConfig): Logger;
    }
    interface Options {
        LOGGER_INSTANCE_NAME: string;
    }
    interface OptionsWithHeader extends Options {
        HEADER_TITLE: string;
        FLOATING_TITLE: string;
        NO_SCROLLING: string;
    }
    class Layout {

    }
    interface Params {
        client: any;
    }
    interface Container { }
    interface LayoutCallback {
        (self: LayoutManager): void;
    }
    class LayoutManager {
        _panels: PanelBase[];
        _currentLayoutName: string;
        _currentLayout: Layout;
        _logger: Core.GmeLogger;
        constructor();
        loadLayout(layout: Layout, callback: LayoutCallback): void;
        loadPanel(params: Params, callback: LayoutCallback): void;
        addPanel(name: string, panel: PanelBase, container: Container): void;
        removePanel(name: string): void;
        setPanelReadOnly(readOnly: boolean): void;
    }
    class PanelManager {
        constructor(client: GME.Client);
        getActivePanel(): PanelBase;
        setActivePanel(panel: PanelBase): void;
    }
    class PanelBase {
        OPTIONS: Options;
        logger: Core.GmeLogger;
        control: any;

        constructor(options: Options);
        setSize(width: number, height: number): void;
        onResize(width: number, height: number): void;

        onReadOnlyChanged(isReadOnly: boolean): void;
        setReadOnly(isReadOnly: boolean): void;
        isReadOnly(): boolean;

        afterAppend(): void;
        setContainerUpdateFn(currentLayout: Layout, sizeUpdateFn: (layout: Layout) => number): void;

        clear(): void;
        destroy(): void;
    }
    class PanelBaseWithHeader extends PanelBase {
        OPTIONS: OptionsWithHeader;

        constructor(options: OptionsWithHeader, layoutManger: LayoutManager);
        initUI(options: OptionsWithHeader): void;
        setTitle(text: string): void;

        setActive(isActive: boolean): void;
        getNodeID(): string;
    }
}



declare namespace Common {

    export interface Dictionary<T> {
        [propName: string]: T;
    }

    export type ISO8601 = string;
    export type ErrorStr = string;
    export type MetadataHash = string;
    export type MetadataHashArray = string[];
    export type ArtifactHash = string;
    export type Name = string;
    export type NodeId = string;
    export type MemberId = Path;
    export type SetId = string;
    export type GUID = string;
    export type Registry = any;
    export type CrosscutsInfo = Registry;

    export type Metadata = { [key: string]: any };
    export type Constraint = string;
    export type AttrMeta = any;
    export type Aspect = string;

    export interface StorageCallback {
        (err: Error): void;
    }

    /**
     * https://github.com/webgme/webgme/blob/master/src/client/js/client/gmeNodeGetter.js
     */
    export class Node {
        _id: string;
        constructor(id: string, logger: Core.GmeLogger, state: any, storeNode: StorageCallback);
        constructor();
        getNode(id: NodeId, logger: Core.GmeLogger, state: any, storeNode: StorageCallback): Node;

        getParentId(): NodeId;
        getId(): NodeId;
        getRelid(): NodeId;
        getGuid(): GUID;
        getChildrenIds(): NodeId[];
        getBaseId(): NodeId;
        isValidNewBase(basePath: Path): boolean;
        isValidNewParent(parentPath: Path): boolean;
        getInheritorIds(): NodeId[];
        getAttribute(name: Name): OutAttr;
        getOwnAttribute(name: Name): OutAttr;
        getEditableAttribute(name: Name): OutAttr;
        getOwnEditableAttribute(name: Name): OutAttr;
        getRegistry(name: Name): Registry;
        getOwnRegistry(name: Name): Registry;
        getEditableRegistry(name: Name): Registry;
        getOwnEditableRegistry(name: Name): Registry;

        getPointer(name: Name): Pointer;
        getPointerId(name: Name): SetId;
        getOwnPointer(name: Name): Pointer;
        getOwnPointerId(name: Name): SetId;
        getPointerNames(): Name[];
        getOwnPointerNames(): Name[];

        getAttributeNames(): Name[];
        getValidAttributeNames(): Name[];
        getOwnAttributeNames(): Name[];
        getOwnValidAttributeNames(): Name[];

        getAttributeMeta(name: Name): AttrMeta;
        getRegistryNames(): Name[];
        getOwnRegistryNames(): Name[];

        /** Set */
        getMemberIds(setId: SetId): Path[];
        getSetNames(): Name[];
        getMemberAttributeNames(setId: SetId, memberId: MemberId): Name[];
        getMemberAttribute(setId: SetId, memberId: MemberId): OutAttr;
        getEditableMemberAttribute(setId: SetId, memberId: MemberId, name: Name): OutAttr;
        getMemberRegistryNames(setId: SetId, memberId: MemberId): Name[];
        getMemberRegistry(setId: SetId, memberId: MemberId, name: Name): Registry;
        getEditableMemberRegistry(setId: SetId, memberId: MemberId, name: Name): Registry;

        /** META */
        getValidChildrenTypes(): NodeId[];
        getValildAttributeNames(): Name[];
        isValidAttributeValueOf(name: Name, value: any): boolean;
        getValidPointerNames(): Name[];
        getValidSetNames(): Name[];
        getConstraintNames(): Name[];
        getOwnConstraintNames(): Name[];
        getConstraint(name: Name): Constraint;
        toString(): string;

        getCollectionPaths(name: Name): Path[];
        getInstancePaths(): Path[];
        getJsonMeta(): Metadata[];

        isConnection(): boolean;
        isAbstract(): boolean;
        isLibraryRoot(): boolean;
        isLibraryElement(): boolean;
        getFullyQualifiedName(): Name;
        getNamespace(): Name;

        getLibraryGuid(): GUID;
        getCrosscutsInfo(): CrosscutsInfo;
        getValidChildrenTypesDetailed(aspect: Aspect, noFilter: boolean): Dictionary<any>;
        getValidSetMemberTypesDetailed(setName: Name): { [key: string]: any };
        getMetaTypeId(): Node | null;
        getBaseTypeId(): Node | null;
        isMetaNode(): boolean;
        isTypeOf(typePath: Path): boolean;
        isValidChildOf(parentPath: Path): boolean;
        getValidChildrenIds(): NodeId[];
        isValidTargetOf(sourcePath: Path, name: Name): boolean;
        getValidAspectNames(): Name[];
        getOwnValidAspectNames(): Name[];
        getAspectMeta(): Metadata;

        /** MixIns */
        getMixinPaths(): Path[];
        canSetAsMixin(mixinPath: Path): boolean;
        isReadOnly(): boolean;

    }
    export class Pointer {
        constructor();

        to: Common.NodeId;
        from: Common.NodeId;
    }

    export type Path = string;

    export type DataObject = Node;
    export type Buffer = GLbyte[];
    export type Payload = string | Buffer | Buffer[];
    export type Content = DataObject | Buffer | Buffer[];
    export type ContentString = string;
    export type Primitive = string | number;
    export type OutAttr = DataObject | Primitive | undefined | null;
    export type InAttr = DataObject | Primitive | null;
    export type OutPath = string | undefined | null;

    export type VoidFn = () => void;

    export type MetadataHashCallback = (err: Error, result: MetadataHash) => void;
    export type MetadataHashArrayCallback = (err: Error, result: MetadataHashArray) => void;
    export type MetadataCallback = (err: Error, result: Metadata) => void;
    export type ObjectCallback = (err: Error, result: DataObject) => void;
    export type ObjectArrayCallback = (err: Error, result: DataObject[]) => void;
    export type JSONCallback = (err: Error, result: JSON) => void;
}

declare namespace Util {

    class Canon {
        stringify(thing: any): string;
        parse(thing: any): string;
    }

    export let CANON: Canon;

    export function ASSERT(condition: boolean): never;
}

declare namespace Blobs {

    export type ObjectBlob = string;

    export interface BlobMetadata {
        name: string;
        size: number;
        mime: string;
        context: Common.DataObject;
        contentType: string;
    }

    export type BlobMetadataDescriptor = {}

    export class BlobClient {
        constructor();

        createArtifact(name: Common.Name): Core.Artifact;
        getArtifact: {
            (metadataHash: Common.MetadataHash, callback: Core.ArtifactCallback): void;
            (metadataHash: Common.MetadataHash): Promise<Core.Artifact>;
        }
        getMetadataURL(metadataHash: Common.MetadataHash): string;
        getRelativeMetadataURL(metadataHash: Common.MetadataHash): string;
        getViewURL(metadataHash: Common.MetadataHash, subpath: string): string;
        getDownloadURL(metadataHash: Common.MetadataHash, subpath: string): string;
        getRelativeDownloadURL(metadataHash: Common.MetadataHash, subpath: string): string;
        getCreateURL(filename: Common.Name, isMetadata: boolean): string;
        getRelativeCreateURL(filename: Common.Name, isMetadata: boolean): string;
        getSubObject: {
            (metadataHash: Common.MetadataHash, subpath: string, callback: Common.ObjectCallback): void;
            (metadataHash: Common.MetadataHash, subpath: string): Promise<Common.DataObject>;
        }
        getObject: {
            (metadataHash: Common.MetadataHash, callback: Common.ObjectCallback, subpath: string): Common.Content;
            (metadataHash: Common.MetadataHash, subpath: string): Promise<Common.Content>;
        }
        getObjectAsString: {
            (metadataHash: Common.MetadataHash, callback: Common.MetadataHashCallback): Common.ContentString;
            (metadataHash: Common.MetadataHash): Promise<Common.ContentString>;
        }
        getObjectAsJSON: {
            (metadataHash: Common.MetadataHash, callback: Common.JSONCallback): void;
            (metadataHash: Common.MetadataHash): Promise<JSON>;
        }
        getMetadata: {
            (metadataHash: Common.MetadataHash, callback: Common.MetadataCallback): Common.Metadata;
            (metadataHash: Common.MetadataHash): Promise<Common.Metadata>;
        }
        getHumanSize(bytes: number, si: boolean): string;
        putFile: {
            (name: Common.Name, data: Common.Payload, callback: Common.MetadataHashCallback): void;
            (name: Common.Name, data: Common.Payload): Promise<Common.MetadataHash>;
        }
        putMetadata: {
            (metadataDescriptor: BlobMetadataDescriptor, callback: Common.MetadataHashCallback): void;
            (metadataDescriptor: BlobMetadataDescriptor): Promise<Common.MetadataHash>;
        }
        putFiles: {
            (o: { [name: string]: Common.Payload }, callback: Common.MetadataHashArrayCallback): void;
            (o: { [name: string]: Common.Payload }): Promise<Common.MetadataHashArray>;
        }
        saveAllArtifacts: {
            (callback: Common.MetadataHashArrayCallback): void;
            (): Promise<Common.MetadataHashArray>;
        }
    }

}


/**
Describe plugins
*/
declare namespace Core {

    export interface ResultCallback {
        (err: Error | null, result: Result): void;
    }

    export interface Message {
        msg: string;
    }

    export type ArtifactCallback = (err: Error, result: Artifact) => void;

    export interface Artifact {
        name: Common.Name;
        blobClient: Blobs.BlobClient;
        descriptor: Blobs.BlobMetadata;

        constructor(name: Common.Name, blobClient: Blobs.BlobClient, descriptor: Blobs.BlobMetadata): void;

        /** Adds content to the artifact as a file. */
        addFile: {
            (name: Common.Name, content: Blobs.ObjectBlob, callback: Common.MetadataHashCallback): void;
            (name: Common.Name, content: Blobs.ObjectBlob): Promise<Common.MetadataHash>;
        }
        /** Adds files as soft-link. */
        addFileAsSoftLink: {
            (name: Common.Name, content: Blobs.ObjectBlob, callback: Common.MetadataHashCallback): void;
            (name: Common.Name, content: Blobs.ObjectBlob): Promise<Common.MetadataHash>;
        }
        /** Adds multiple files. */
        addFiles: {
            (files: { [name: string]: Blobs.ObjectBlob }, callback: Common.MetadataHashArrayCallback): void;
            (files: { [name: string]: Blobs.ObjectBlob }): Promise<Common.MetadataHashArray> | Promise<string>;
        }
        /** Adds multiple files as soft-links. */
        addFilesAsSoftLinks: {
            (files: { [name: string]: Blobs.ObjectBlob }, callback: Common.MetadataHashArrayCallback): void;
            (files: { [name: string]: Blobs.ObjectBlob }): Promise<Common.MetadataHashArray>;
        }
        /** Adds a metadataHash to the artifact using the given file path. */
        addMetadataHash: {
            (name: Common.Name, metadataHash: Common.MetadataHash, size: number, callback: Common.MetadataHashCallback): void;
            (name: Common.Name, metadataHash: Common.MetadataHash, size?: number): Promise<Common.MetadataHash>;

            (objectHashes: { [name: string]: string }, callback: Common.MetadataHashCallback): void;
            (objectHashes: { [name: string]: string }): Promise<Common.MetadataHash>;
        }
        /** Adds metadataHashes to the artifact using the given file paths. */
        addMetadataHashes: {
            (name: Common.Name, metadataHash: Common.MetadataHash, size: number, callback: Common.MetadataHashArrayCallback): void;
            (name: Common.Name, metadataHash: Common.MetadataHash, size?: number): Promise<Common.MetadataHashArray>;

            (objectHashes: { [name: string]: string }, callback: Common.MetadataHashArrayCallback): void;
            (objectHashes: { [name: string]: string }): Promise<Common.MetadataHashArray>;
        }
        /** Adds a metadataHash to the artifact using the given file path. */
        addObjectHash: {
            (name: Common.Name, metadataHash: Common.MetadataHash, callback: Common.MetadataHashCallback): void;
            (name: Common.Name, metadataHash: Common.MetadataHash): Promise<Common.MetadataHash>;
        }
        /** Adds metadataHashes to the artifact using the given file paths. */
        addObjectHashes: {
            (objectHashes: { [name: string]: string }, callback: Common.MetadataHashArrayCallback): void;
            (objectHashes: { [name: string]: string }): Promise<Common.MetadataHashArray>;
        }
        /** Saves this artifact and uploads the metadata to the server's storage. */
        save: {
            (callback: Common.MetadataHashCallback): void;
            (message?: string): Promise<Common.MetadataHash>;
        }
    }
    /**
     commitHash - metadataHash of the commit.
     status - storage.constants./SYNCED/FORKED/MERGED
    */
    export interface Commit {
        commitHash: Common.MetadataHash;
        status: string;
        branchName: string;
    }

    export interface Result {
        success: boolean;
        messages: string[]; // array of PluginMessages
        artifacts: Common.ArtifactHash[]; // array of hashes
        pluginName: string;
        startTime: Date;
        finishTime: Date;
        error: Error;
        projectId: any;
        commits: any[];

        /**
        * Gets the success flag of this result object
        */
        getSuccess(): boolean;
        /**
        * Sets the success flag of this result.
        */
        setSuccess(value: boolean): void;
        /**
        * Returns with the plugin messages.
        */
        getMessages(): Message[];
        /**
        * Adds a new plugin message to the messages list.
        */
        addMessage(pluginMessage: Message): void;
        /**
        * Returns the plugin artifacts.
        */
        getArtifacts(): Artifact[];
        /**
        * Adds a saved artifact to the result - linked via its metadataHash.
        * Takes the metadataHash of saved artifact.
        */
        addArtifact(metadataHash: Common.MetadataHash): void;
        /**
        * Adds a commit to the commit container.
        */
        addCommit(commitData: Commit): void;
        /**
        * Gets the name of the plugin to which the result object belongs.
        */
        getPluginName(): string;
        //------------------------------------------
        // Methods used by the plugin manager
        //-----------------------------------------
        /**
        * Sets the name of the plugin to which the result object belongs to.
        */
        setPluginName(pluginName: string): string;
        /**
        * Sets the name of the projectId the result was generated from.
        */
        setProjectId(projectId: string): void;
        /**
        * Gets the ISO 8601 representation of the time when the plugin started its execution.
        */
        getStartTime(): Common.ISO8601;
        /**
        * Sets the ISO 8601 representation of the time when the plugin started its execution.
        */
        setStartTime(time: Common.ISO8601): void;
        /**
        * Gets the ISO 8601 representation of the time when the plugin finished its execution.
        */
        getFinishTime(): Common.ISO8601;
        /**
        * Sets the ISO 8601 representation of the time when the plugin finished its execution.
        */
        setFinishTime(time: Common.ISO8601): void;
        /**
        * Gets error if any error occured during execution.
        * FIXME: should this return an Error object?
        */
        getError(): Common.ErrorStr;
        /**
        * Sets the error string if any error occured during execution.
        */
        setError(error: Common.ErrorStr | Error): void;
        /**
        * Serializes this object to a JSON representation.
        */
        serialize(): { success: boolean, messages: Message[], pluginName: string, finishTime: string };
    }


    export interface RelationRule {
        /** The minimum amount of target necessary for the relationship (if not present or '-1' then there is no minimum rule that applies) */
        min?: number;
        /** The maximum amount of target necessary for the relationship (if not present or '-1' then there is no maximum rule that applies) */
        max?: number;
        absolutePathOfTarget?: {
            min?: number;
            max?: number;
        }
    }

    export interface Constraint {
        script: string;
        info: string;
        priority: string;
    }

    export interface MixinViolation {
        severity?: string;
        type?: string;
        ruleName?: string | undefined;
        targetInfo?: string | undefined;
        targetNode?: Common.Node | undefined;
        collisionPaths?: string[];
        collisionNodes?: Common.Node[];
        message?: string;
        hint?: string;
    }
    export interface GmePersisted { rootHash: Common.MetadataHash }
    export enum TraversalOrder { 'BFS', 'DFS' }

    export interface NodeParameters {
        parent: Common.Node | null;
        base: Common.Node | null;
        relid?: string;
        guid?: Common.GUID;
    }
    export interface LibraryInfo {
        projectId: string;
        branchName: string;
        commitHash: string;
    }
    export interface MetaNodeParameters {
        object: { node: Common.Node, children: Common.Node[] };
        sensitive: boolean;
        multiplicity: boolean;
        aspect: string;
    }
    export interface MetaRule {
        type: string | number | boolean;
        enum: string[];
    }

    export interface TraversalOptions {
        excludeRoot?: boolean;
        order?: TraversalOrder;
        maxParallelLoad?: number;
        stopOnError?: boolean;
    }

    export interface Core {

        addLibrary: {
            (node: Common.Node, name: Common.Name, libraryRootHash: string,
                libraryInfo: LibraryInfo, callback: Common.ObjectCallback): void;
            (node: Common.Node, name: Common.Name, libraryRootHash: string,
                libraryInfo: LibraryInfo): Promise<Common.DataObject>;
        }
        addMember(node: Common.Node, name: Common.Name, member: Common.Node): undefined | Error;
        addMixin(node: Common.Node, mixinPath: string): undefined | Error;
        applyResolution(conflict: {}): {};
        applyTreeDiff: {
            (root: Common.Node, patch: Common.DataObject, callback: Common.ObjectCallback): void;
            (root: Common.Node, patch: Common.DataObject): Promise<Common.DataObject>;
        }
        canSetAsMixin(node: Common.Node, mixinPath: string): boolean | string;
        clearMetaRules(node: Common.Node): undefined | Error;
        clearMixins(node: Common.Node): undefined | Error;
        copyNode(node: Common.Node, parent: Common.Node): Common.Node | Error;
        copyNodes(nodes: Common.Node[], parent: Common.Node): Common.Node[] | Error;
        createNode(parameters: NodeParameters): Common.Node | Error;
        createSet(node: Common.Node, name: Common.Name): undefined | Error;
        delAspectMeta(node: Common.Node, name: Common.Name): undefined | Error;
        delAspectMetaTarget(node: Common.Node, name: Common.Name, targetPath: string): undefined | Error;
        delAttribute(node: Common.Node, name: Common.Name): undefined | Error;
        delAttributeMeta(node: Common.Node, name: Common.Name): undefined | Error;
        delChildMeta(node: Common.Node, childPath: string): undefined | Error;
        delConstraint(node: Common.Node, name: Common.Name): undefined | Error;
        deleteNode(node: Common.Node): undefined | Error;
        deletePointer(node: Common.Node, name: Common.Name): undefined | Error;
        deleteSet(node: Common.Node, name: Common.Name): undefined | Error;
        delMember(node: Common.Node, name: Common.Name, path: string): undefined | Error;
        delMemberAttribute(node: Common.Node, setName: string, memberPath: string, attrName: string): undefined | Error;
        delMemberRegistry(node: Common.Node, setName: string, memberPath: string, regName: string): undefined | Error;
        delMixin(node: Common.Node, mixinPath: string): undefined | Error;
        delPointerMeta(node: Common.Node, name: Common.Name): undefined | Error;
        delPointerMetaTarget(node: Common.Node, name: Common.Name, targetPath: string): undefined | Error;
        delRegistry(node: Common.Node, name: Common.Name): undefined | Error;
        generateTreeDiff: {
            (sourceRoot: Common.Node, targetRoot: Common.Node, callBack: Common.ObjectCallback): void;
            (sourceRoot: Common.Node, targetRoot: Common.Node): Promise<Common.DataObject>;
        }
        getAllMetaNodes(node: Common.Node): { [name: string]: Common.Node };
        getAspectMeta(node: Common.Node, name: Common.Name): string[];
        /**
        * Retrieves the value of the given attribute of the given node.
        * @param node - the node in question.
        * @param name - the name of the attribute.
        *
        * @return The function returns the value of the attribute of the node.
        * The retrieved attribute should not be modified as is - it should be copied first!
        * The value can be an object or any primitive type.
        * If the return value is undefined; the node does not have such attribute defined.
        * If the node is undefined the returned value is null.
        */
        getAttribute(node: Common.Node | undefined, name: Common.Name): Common.OutAttr;
        getAttributeMeta(node: Common.Node, name: Common.Name): {};
        /** Get the defined attribute names */
        getAttributeNames(node: Common.Node): string[];
        /** Get the base node */
        getBase(node: Common.Node): Common.Node; // null
        /** Get the base node at the top of the inheritance chain (typically the fco). */
        getBaseRoot(node: Common.Node): Common.Node;
        /** Get the most specific meta node. */
        getBaseType(node: Common.Node): Common.Node; // null
        getChild(node: Common.Node, relativeId: string): Common.Node;
        getChildrenHashes(node: Common.Node): { [name: string]: Common.MetadataHash };
        getChildrenMeta(node: Common.Node): RelationRule;
        /** The children paths are available from the node. */
        getChildrenPaths(parent: Common.Node): string[];
        getChildrenRelids(parent: Common.Node): string[];
        getCollectionNames(node: Common.Node): string[];
        getCollectionPaths(node: Common.Node, name: Common.Name): string[];
        getConstraint(node: Common.Node, name: Common.Name): Constraint; // null
        getConstraintNames(node: Common.Node): string[];
        getFCO(node: Common.Node): Common.Node;
        getFullyQualifiedName(node: Common.Node): string;
        getGuid(node: Common.Node): Common.GUID;
        getHash(node: Common.Node): Common.MetadataHash;
        getJsonMeta(node: Common.Node): {};
        getLibraryGuid(node: Common.Node, name: Common.Name): Common.GUID | Error;
        getLibraryInfo(node: Common.Node, name: Common.Name): LibraryInfo;
        getLibraryMetaNodes(node: Common.Node, name: Common.Name, onlyOwn?: boolean): Common.Node[];
        getLibraryNames(node: Common.Node): string[];
        getLibraryRoot(node: Common.Node, name: Common.Name): Common.Node; // null
        getMemberAttribute(node: Common.Node, setName: string, memberPath: string, attrName: string): Common.OutAttr;
        getMemberAttributeNames(node: Common.Node, name: Common.Name, memberPath: string): string[];
        getMemberOwnAttributeNames(node: Common.Node, name: Common.Name, memberPath: string): string[];
        getMemberOwnRegistry(node: Common.Node, name: Common.Name, memberPath: string): string[];
        getMemberPaths(node: Common.Node, name: Common.Name): string[];
        getMemberRegistry(node: Common.Node, setName: string, memberPath: string, regName: string): Common.OutAttr;
        getMemberRegistryNames(node: Common.Node, name: Common.Name, memberpath: string): string[];
        getMixinErrors(node: Common.Node): MixinViolation[];
        getMixinNodes(node: Common.Node): { [name: string]: Common.Node };
        getMixinPaths(node: Common.Node): string[];
        getNamespace(node: Common.Node): string;
        getOwnAttribute(node: Common.Node, name: Common.Name): Common.OutAttr;
        getOwnAttributeNames(node: Common.Node): string[];
        getOwnChildrenPaths(parent: Common.Node): string[];
        getOwnChildrenRelids(parent: Common.Node): string[];
        getOwnConstraintNames(node: Common.Node): string[];
        getOwnJsonMeta(node: Common.Node): Common.DataObject;
        getOwnMemberPaths(node: Common.Node, name: Common.Name): string[];
        getOwnMixinNodes(node: Common.Node): { [name: string]: Common.Node };
        getOwnMixinPaths(node: Common.Node): string[];
        getOwnPointerNames(node: Common.Node): string[];
        getOwnPointerPath(node: Common.Node, name: Common.Name): Common.OutPath;
        getOwnRegistry(node: Common.Node, name: Common.Name): Common.OutAttr;
        getOwnRegistryNames(node: Common.Node): string[];
        getOwnValidAspectNames(node: Common.Node): string[];
        getOwnValidAttributeNames(node: Common.Node): string[];
        /** The parent paths are available from the node. */
        getParent(node: Common.Node): Common.Node;
        /**  Get the path/id */
        getPath(node: Common.Node): string;
        getPointerMeta(node: Common.Node, name: Common.Name): RelationRule;
        getPointerNames(node: Common.Node): string[];
        getPointerPath(node: Common.Node, name: Common.Name): Common.OutPath;
        /** Get the assigned registry */
        getRegistry(node: Common.Node, name: Common.Name): Common.OutAttr;
        /** Get the defined registry names */
        getRegistryNames(node: Common.Node): string[];
        /** Get the relative id */
        getRelid(node: Common.Node): string;
        getRoot(node: Common.Node): Common.Node;
        getSetNames(node: Common.Node): string[];
        getTypeRoot(node: Common.Node): Common.Node;
        getValidAspectNames(node: Common.Node): string[];
        getValidAttributeNames(node: Common.Node): string[];
        getValidChildrenMetaNodes(parameters: MetaNodeParameters): Common.Node[];
        getValidChildrenPaths(node: Common.Node): string[];
        getValidPointerNames(node: Common.Node): string[];
        getValidSetMetaNodes(parameters: MetaNodeParameters): Common.Node[];
        getValidSetNames(node: Common.Node): string[];
        isAbstract(node: Common.Node): boolean;
        /** Connections are just nodes with two pointers named "src" and "dst". */
        isConnection(node: Common.Node): boolean;
        isEmpty(node: Common.Node): boolean;
        isFullyOverriddenMember(node: Common.Node, setName: string, memberPath: string): boolean;
        isInstanceOf(node: Common.Node, name: Common.Name): boolean;
        isLibraryElement(node: Common.Node): boolean;
        isLibraryRoot(node: Common.Node): boolean;
        isMemberOf(node: Common.Node): Common.DataObject;
        isMetaNode(node: Common.Node): boolean;
        isTypeOf(node: Common.Node, type: Common.Node): boolean;
        isValidAttributeValueOf(node: Common.Node, name: Common.Name, value: Common.InAttr): boolean;
        isValidChildOf(node: Common.Node, parent: Common.Node): boolean;
        isValidTargetOf(node: Common.Node, source: Common.Node, name: Common.Name): boolean;
        loadByPath: {
            (startNode: Common.Node, relativePath: string, callback: Common.ObjectCallback): void;
            (startNode: Common.Node, relativePath: string): Promise<Common.DataObject>;
        };
        loadChild: {
            (parent: Common.Node, relativeId: string, callback: Common.ObjectCallback): void;
            (parent: Common.Node, relativeId: string): Promise<Common.DataObject>;
        };
        /** Loading the children however requires data that is not (necessarily) available */
        loadChildren: {
            (parent: Common.Node, callback: Common.ObjectArrayCallback): void;
            (parent: Common.Node): Promise<Common.DataObject>;
        }
        loadCollection: {
            (target: Common.Node, pointerName: string, callback: Common.ObjectCallback): void;
            (target: Common.Node, pointerName: string): Promise<Common.DataObject>;
        };
        loadOwnSubTree: {
            (node: Common.Node, callback: Common.ObjectCallback): void;
            (node: Common.Node): Promise<Common.DataObject>;
        };
        loadPointer: {
            (node: Common.Node, pointerName: string, callback: Common.ObjectCallback): void;
            (node: Common.Node, pointerName: string): Promise<Common.DataObject>;
        };
        loadRoot: {
            (metadataHash: Common.MetadataHash, callback: Common.ObjectCallback): void;
            (metadataHash: Common.MetadataHash): Promise<Common.DataObject>;
        };
        loadSubTree: {
            (node: Common.Node, callback: Common.ObjectCallback): void;
            (node: Common.Node): Promise<Common.DataObject>;
        };
        loadTree: {
            (rootHash: Common.MetadataHash, callback: Common.ObjectCallback): void;
            (rootHash: Common.MetadataHash): Promise<Common.DataObject>;
        };
        moveNode(node: Common.Node, parent: Common.Node): Common.Node | Error;
        persist(node: Common.Node): GmePersisted;
        removeLibrary(node: Common.Node, name: Common.Name): void;
        renameLibrary(node: Common.Node, oldName: string, newName: string): void;
        setAspectMetaTarget(node: Common.Node, name: Common.Name, target: Common.Node): undefined | Error;
        setAttribute(node: Common.Node, name: Common.Name, value: Common.InAttr): undefined | Error;
        setAttributeMeta(node: Common.Node, name: Common.Name, rule: MetaRule): undefined | Error;
        setBase(node: Common.Node, base: Common.Node): undefined | Error;
        setChildMeta(node: Common.Node, child: Common.Node, min?: number, max?: number): undefined | Error;
        setChildrenMetaLimits(node: Common.Node, min?: number, max?: number): undefined | Error;
        setConstraint(node: Common.Node, name: Common.Name, constraint: Constraint): undefined | Error;
        setGuid: {
            (node: Common.Node, guid: Common.GUID, callback: Common.ObjectCallback): undefined | Error;
            (node: Common.Node, guid: Common.GUID): Promise<Common.DataObject>;
        };
        setMemberAttribute: {
            (node: Common.Node, setName: string, memberPath: string,
                SVGPathSegLinetoHorizontalAbsme: string,
                value?: Common.InAttr): undefined | Error;
        };
        setMemberRegistry(node: Common.Node, setName: string, memberPath: string, regName: string,
            value?: Common.InAttr): undefined | Error;
        setPointer(node: Common.Node, name: Common.Name, target: Common.Node | null): undefined | Error;
        setPointerMetaLimits(node: Common.Node, memberPath: string,
            min?: number, max?: number): undefined | Error;
        setPointerMetaTarget(node: Common.Node, name: Common.Name, target: Common.Node, min?: number, max?: number): undefined | Error;
        /** Get the assigned registry */
        setRegistry(node: Common.Node, name: Common.Name, value: Common.InAttr): undefined | Error;

        /**
         * the visitation function will be called for
         * every node in the sub-tree, the second parameter of the function
         * is a callback that should be called to
         * note to the traversal function that the visitation for a given node is finished.
         */
        traverse: {
            // takes a callback & returning *no* promise
            (node: Common.Node,
                options: TraversalOptions,
                visitFn: (node: Common.Node, finished: Common.VoidFn) => void,
                callback: Common.ObjectCallback)
                : void;
            // takes *no* callback & returns a promise
            (node: Common.Node,
                options: TraversalOptions,
                visitFn: (node: Common.Node, finished: Common.VoidFn) => void)
                : Promise<void>;
        }
        tryToConcatChanges(mine: Common.DataObject, theirs: Common.DataObject): Common.DataObject;
        updateLibrary: {
            (node: Common.Node, name: Common.Name, libraryRootHash: Common.MetadataHash,
                libraryInfo: LibraryInfo, callback: Common.ObjectCallback): void;
            (node: Common.Node, name: Common.Name, libraryRootHash: Common.MetadataHash,
                libraryInfo: LibraryInfo): Promise<Common.DataObject>;
        }
    }



    /**
    Logs debug messages
    https://editor.webgme.org/docs/source/global.html#GmeLogger
    */
    export interface GmeLogger {
        debug(fmt: string, msg?: string | undefined): void;
        info(fmt: string, msg?: string | undefined): void;
        warn(fmt: string, msg?: string | undefined): void;
        error(fmt: string, msg?: string | undefined): void;
        /**
        Creates a new logger with the same settings
        and a name that is an augmentation of this logger and the
        provided string.
        If the second argument is true
        - the provided name will be used as is.
        */
        fork(fmt: string, reuse?: boolean): GmeLogger;
    }
    export interface ProjectInterface {

    }


    export interface ThenCallback {
        (): void;
    }
    export interface CatchCallback {
        (err: Error): void;
    }

    export interface Promisable {
        then(callback: ThenCallback): Promisable;
        catch(callback: CatchCallback): Promisable;
    }

    /**
    The base plugin object from which all plugins should inherit.
    */
    export interface Base {

        activeNode: Common.Node;
        activeSelection: Common.Node[];
        blobClient: Blobs.BlobClient;
        core: Core;
        gmeConfig: Config.GmeConfig;
        isConfigured: boolean;
        logger: GmeLogger;
        /**
         * The resolved META nodes based on the active namespace. Index by the fully qualified meta node names
         * with the namespace stripped off at the start.
         *
         * For example, if a project has a library A with a library B. If the project and the libraries all have
         * two meta nodes named a and b. Depending on the namespace the META will have the following keys:
         *
         * 1) namespace = '' -> ['a', 'b', 'A.a', 'A.b', 'A.B.a', 'A.B.b']
         * 2) namespace = 'A' -> ['a', 'b', 'B.a', 'B.b']
         * 3) namespace = 'A.B' -> ['a', 'b']
         *
         * (N.B. 'a' and 'b' in example 3) are pointing to the meta nodes defined in A.B.)
         */
        META: any;
        /**
         * The namespace the META nodes are coming from (set by invoker).
         * The default is the full meta, i.e. the empty string namespace.
         * For example, if a project has a library A with a library B. The possible namespaces are:
         * '', 'A' and 'A.B'.
         */
        namespace: string;
        notificationHandlers: any[];
        pluginMetadata: Common.Metadata;
        project: ProjectInterface;
        result: Result;
        rootNode: Common.Node;

        addCommitToResult(status: string): void;
        baseIsMeta(node: any): boolean;

        configure(config: Config.GmeConfig): void;
        createMessage(node: any, message: string, serverity: string): void;
        /**
         * Gets the configuration structure for the plugin.
         * The ConfigurationStructure defines the configuration for the plugin
         * and will be used to populate the GUI when invoking the plugin from webGME.
         */
        getConfigStructure(): Config.ConfigItem[];
        getCurrentConfig(): Config.GmeConfig;
        getDefaultConfig(): Config.GmeConfig;
        /**
         * Gets the description of the plugin.
         */
        getDescription(): string;
        getMetadata(): any;
        getMetaType(node: any): any;
        /**
         * Gets the name of the plugin.
         */
        getName(): string;
        /**
         * Gets the semantic version (semver.org) of the plugin.
         */
        getVersion(): string;
        initialize(logger: GmeLogger, blobClient: Blobs.BlobClient, gmeConfig: Config.GmeConfig): void;
        isInvalidActiveNode(pluginId: any): any;
        isMetaTypeOf(node: any, metaNode: any): boolean;
        /**
          Main function for the plugin to execute.
          Notes:
          - Always log with the provided logger.[error,warning,info,debug].
          - Do NOT put any user interaction logic UI, etc. inside this method.
          - handler always has to be called even if error happened.
     
          When this runs the core api is used to extract the essential
          meta-model and the model-instance, these are then written to the mega-model.
          The mega-model contains all of the models used to describe the target system.
     
          https://github.com/ptaoussanis/sente
          and https://github.com/cognitect/transit-format
          will be used to connect to the
          graph database (immortals) where the mega-model is stored.
     
          @param {function(string, plugin.PluginResult)} handler - the result handler
         */
        main(callback: ResultCallback): void;
        save(message?: string): Promisable; // returns a promise?
        sendNotification: {
            (message: string, callback: Common.ObjectCallback): void;
            (message: string): Promise<Common.DataObject>;
        }
        setCurrentConfig(newConfig: Config.GmeConfig): void;
        updateMeta(generatedMeta: any): void;
        updateSuccess(value: boolean, message: TemplateStringsArray): void;
    }

    class PluginBase implements Base {
        constructor();

        activeNode: Common.Node;
        activeSelection: Common.Node[];
        blobClient: Blobs.BlobClient;
        core: Core.Core;
        gmeConfig: Config.GmeConfig;
        isConfigured: boolean;
        logger: Core.GmeLogger;
        META: any;
        namespace: string;
        notificationHandlers: any[];
        pluginMetadata: Common.Metadata;
        project: Core.ProjectInterface;
        result: Core.Result;
        rootNode: Common.Node;

        addCommitToResult(status: string): void;
        baseIsMeta(node: any): boolean;
        configure(config: Config.GmeConfig): void;
        createMessage(node: any, message: string, serverity: string): void;
        getConfigStructure(): any;
        getCurrentConfig(): Config.GmeConfig;
        getDefaultConfig(): Config.GmeConfig;
        getDescription(): string;
        getMetadata(): any;
        getMetaType(node: any): any;
        getName(): string;
        getVersion(): string;
        initialize(logger: GmeLogger, blobClient: Blobs.BlobClient, gmeConfig: Config.GmeConfig): void;
        isInvalidActiveNode(pluginId: any): any;
        isMetaTypeOf(node: any, metaNode: any): boolean;
        main(callback: Core.ResultCallback): void;
        save(message?: string): Core.Promisable;
        sendNotification: {
            (message: string, callback: Core.ResultCallback): void;
            (message: string): Promise<Common.DataObject>;
        }
        setCurrentConfig(newConfig: Config.GmeConfig): void;
        updateMeta(generatedMeta: any): void;
        updateSuccess(value: boolean, message: TemplateStringsArray): void;
    }

}

/**
 * Each Plugin has a configuration specified via a metadata.json file.
 * This interface prescribes that configuration file.
 * 
 */
declare namespace Config {


    export interface ConfigItem {
        // a unique name for the configuration item
        name: Common.Name;
        // a human comprehensible name
        displayName: string;
        // a detailed description fo the item
        description: string;
        // the value of the item: if valueItem is provided it must be one of those values.
        value: string;
        // the datatype of the value: 'string', 'integer', ...
        valueType: string,
        // an enumeration of the allowed values for the value field
        valueItems?: string[];
        // a regular expression limiting the values allowed.
        // e.g. '^[a-zA-Z]+$'
        regex?: RegExp;
        // a description of the regex grammar
        // e.g. 'Name can only contain English characters!'
        regexMessage?: string;
        // can the value be changed?
        readOnly?: boolean;
    }


    /**
       https://editor.webgme.org/docs/source/global.html#GmeConfig	
       https://github.com/webgme/webgme/blob/master/config/README.md
    */
    export interface LogOptions { log: { level: string } }

    export class GmeConfig {
        constructor();
        /**  Add-on related settings. */
        addOns: any;
        /**  Authentication related settings. */
        authentication: {
            enable: boolean,
            jwt: { privateKey: string, publicKey: string },
            logInUrl: string,
            logOutUrl: string
        };
        /** Bin script related settings. */
        bin: any;
        /** Blob related settings. */
        blob: Blobs.ObjectBlob;
        /** Client related settings. */
        client: LogOptions;
        /** Client related settings. */
        core: Core.Core;
        /** Enables debug mode. */
        public debug: boolean;
        /** Executor related settings. */
        executor: any;
        /** Mongo database related settings. */
        mongo: { uri: string };
        /** Plugin related settings. */
        plugin: {
            basePaths: string[],
            allowBrowserExecution: boolean,
            allowServerExecution: boolean
        };
        /** Additional paths to for requirejs. */
        requirejsPaths: Common.Dictionary<string>;
        /** REST related settings. */
        rest: any;
        /** Seed related settings. */
        seedProjects: {
            basePaths: string[],
            panelPaths: string[],
            enable: boolean,
            allowDuplication: boolean
        };
        /** Server related settings. */
        server: {
            port: number, handle: { fd: number },
            log: any
        };
        /** Socket IO related settings. */
        socketIO: any;
        /** Storage related settings. */
        storage: any;
        /** Visualization related settings. */
        visualization: {
            panelPaths: string[],
            visualizerDescriptors: string[],
            extraCss: string[]
        };

        serialize(): any;
    }


    export class PluginConfig extends Config.GmeConfig {
        [propName: string]: any;
    }

    export let config: PluginConfig;

}

/**
Things in this module are deprecated.
This was a serialization supported in version 1.
*/
declare module "webgme/v1" {
    export type GUID = string;

    export interface JsonContainment {
        [index: string]: JsonContainment;
    }
    export interface JsonNode {
        attributes: any;
        base: string;
        meta: any;
        parent: string;
        pointers: any;
        registry: any;
        sets: any;
        constratints: any;
    }
    export interface JsonObj {
        root: { path: string; guid: GUID };
        containment: JsonContainment; // guid tree of hashes
        bases: any; //
        nodes: any;
        relids: any;
        metaSheets: any;
    }
}