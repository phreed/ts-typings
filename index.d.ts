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
        context: Core.DataObject;
        contentType: string;
    }
}

declare module "plugin/PluginBase" {
    export = GmePlugin.PluginBase;
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
        function isConnection(node: Core.Node): boolean;

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
    type Connection = any;

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
    type ProjectResult = Project[] | { [key: string]: Project };

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
        pointers: Common.Dictionary<Common.Pointer>;
        srcPos: Pos2D;
        dstPos: Pos2D;
        srcObjId: string;
        dstObjId: string;

        control?: VisualizerControl;
        metaInfo?: Common.Dictionary<string>;
        preferencesHelper?: GME.PreferenceHelper;
        srcSubCompId?: string;
        dstSubCompId?: string;
        reconnectable?: boolean;
        editable?: boolean;
    }
    /**
     * primary values are: 'load' 'update' 'unload'
     */
    export type TerritoryEventType = "load" | "unload" | "update" | "complete" | "incomplete";

    interface Event {
        id?: string;
        etype: TerritoryEventType;
        eid: string;
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

    type TerritoryId = Core.GUID;
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
        connectToDatabase(callback: Common.ResultCallback<Connection>): void;
        /**
         * asIndexed true to get an object indexed by project ids.
         */
        getProjectsAndBranches(asIndexed: boolean, callback: Common.ResultCallback<ProjectResult>): void;
        /**
         * The client opens a project and a branch and 
         * from there we can start registering for node events.
         */
        selectProject(projectId: string, branchName: string, callback: Common.ResultCallback<any>): void;
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
        updateTerritory(userId: string, patterns: Common.Dictionary<TerritoryPattern>): void;
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
        getNode(nodeId: Common.NodeId): Core.Node;
        /**
         * Get an array of all the META nodes as nodeObjs.
         * Since these may change it is a good idea to invoke 
         * this each time the territory of the root changes.
         */
        getAllMetaNodes(): Core.Node[];

        setAttributes(nodeId: Common.NodeId, name: string, newName: string, message: string): void;
        createChild(params: ChildCreationParams, message: string): void;
        delMoreNodes(nodeIds: Common.NodeId[], message: string): void;

        /**
         * Transactions
         */
        startTransaction(message: string): void;
        setRegistry(nodeId: Common.NodeId, attr: string, property: any, message: string): void;
        completeTransaction(message: string, callback: Common.ResultCallback<TransactionResult>): void;

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

        getAllMetaNodes(): Core.Node[];
        setAttributeSchema(nodeId: string, name: string, schema: AttributeSchema): void;
        updateValidChildrenItem(nodeId: Common.NodeId, type: ChildType): void

        setPointerMeta(metaNodeId: Common.NodeId, newPointerName: string, meta: GME.PointerMeta): void;

    }

}
declare const WebGMEGlobal: Global.WebGmeGlobal;

declare namespace Classes {

    export type ArtifactCallback = (err: Error, result: Artifact) => void;

    export interface Artifact {
        name: Common.Name;
        blobClient: Blobs.BlobClient;
        descriptor: Blobs.BlobMetadata;

        constructor(name: Common.Name, blobClient: Blobs.BlobClient, descriptor: Blobs.BlobMetadata): void;

        /** Adds content to the artifact as a file. */
        addFile: {
            (name: Common.Name, content: Blobs.ObjectBlob, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (name: Common.Name, content: Blobs.ObjectBlob): Promise<Common.MetadataHash>;
        }
        /** Adds files as soft-link. */
        addFileAsSoftLink: {
            (name: Common.Name, content: Blobs.ObjectBlob, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (name: Common.Name, content: Blobs.ObjectBlob): Promise<Common.MetadataHash>;
        }
        /** Adds multiple files. */
        addFiles: {
            (files: { [name: string]: Blobs.ObjectBlob }, callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (files: { [name: string]: Blobs.ObjectBlob }): Promise<Common.MetadataHash[]> | Promise<string>;
        }
        /** Adds multiple files as soft-links. */
        addFilesAsSoftLinks: {
            (files: { [name: string]: Blobs.ObjectBlob }, callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (files: { [name: string]: Blobs.ObjectBlob }): Promise<Common.MetadataHash[]>;
        }
        /** Adds a metadataHash to the artifact using the given file path. */
        addMetadataHash: {
            (name: Common.Name, metadataHash: Common.MetadataHash, size: number, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (name: Common.Name, metadataHash: Common.MetadataHash, size?: number): Promise<Common.MetadataHash>;

            (objectHashes: { [name: string]: string }, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (objectHashes: { [name: string]: string }): Promise<Common.MetadataHash>;
        }
        /** Adds metadataHashes to the artifact using the given file paths. */
        addMetadataHashes: {
            (name: Common.Name, metadataHash: Common.MetadataHash, size: number, callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (name: Common.Name, metadataHash: Common.MetadataHash, size?: number): Promise<Common.MetadataHash[]>;

            (objectHashes: { [name: string]: string }, callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (objectHashes: { [name: string]: string }): Promise<Common.MetadataHash[]>;
        }
        /** Adds a metadataHash to the artifact using the given file path. */
        addObjectHash: {
            (name: Common.Name, metadataHash: Common.MetadataHash, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (name: Common.Name, metadataHash: Common.MetadataHash): Promise<Common.MetadataHash>;
        }
        /** Adds metadataHashes to the artifact using the given file paths. */
        addObjectHashes: {
            (objectHashes: { [name: string]: string }, callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (objectHashes: { [name: string]: string }): Promise<Common.MetadataHash[]>;
        }
        /** Saves this artifact and uploads the metadata to the server's storage. */
        save: {
            (callback: Common.ResultCallback<Common.MetadataHash>): void;
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
        /** array of PluginMessages */
        messages: string[];
        /** array of hashes */
        artifacts: Common.ArtifactHash[];
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
        getMessages(): Common.Message[];
        /**
        * Adds a new plugin message to the messages list.
        */
        addMessage(pluginMessage: Common.Message): void;
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
        serialize(): { success: boolean, messages: Common.Message[], pluginName: string, finishTime: string };
    }


    export enum TraversalOrder { 'BFS', 'DFS' }

    /**
     * The details of a nodes creation.
     */
    export interface NodeParameters {
        /** the parent of the node to be created. */
        parent?: Core.Node | null;
        /** the base of the node to be created. */
        base?: Core.Node | null;
        /** the relative id of the node to be created 
         * (if reserved, the function returns the node behind the relative id) */
        relid?: Common.RelId;
        /** the GUID of the node to be created */
        guid?: Core.GUID;
    }
    /**
     * information about your library project.
     */
    export interface LibraryInfo {
        /** the projectId of your library. */
        projectId: string;
        /** the branch that your library follows in the origin project. */
        branchName: string;
        /** the version of your library. */
        commitHash: string;
    }
    /**
     * used by getValidChildrenMetaNodes
     */
    export interface MetaNodeParameters {
        /** the input parameters of the query. */
        object: {
            node: Core.Node,
            children?: Core.Node[]
        };
        /** 
         * if true, the query filters out the 
         * abstract and connection-like nodes 
         * (the default value is false) 
         */
        sensitive?: boolean;
        /**
         * if true, 
         * the query tries to filter out even 
         * more nodes according to the multiplicity rules 
         * (the default value is false, 
         * the check is only meaningful if all the children were passed)
         */
        multiplicity?: boolean;
        /**
         * if given, 
         * the query filters to contain only types 
         * that are visible in the given aspect.
         */
        aspect?: string;
    }
    /**
     * used by getValidSetMetaNodes
     */
    export interface MetaSetParameters {
        /** the input parameters of the query. */
        object: {
            /** the node in question. */
            node: Core.Node;
            /** the name of the set. */
            name: Common.Name;
            /** the members of the set of the node in question. */
            members?: Core.Node[]
        };
        /** 
         * if true, the query filters out the 
         * abstract and connection-like nodes 
         * (the default value is false) 
         */
        sensitive?: boolean;
        /**
         * if true, 
         * the query tries to filter out even 
         * more nodes according to the multiplicity rules 
         * (the default value is false, 
         * the check is only meaningful if all the children were passed)
         */
        multiplicity?: boolean;
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

    /**
     * The relationship between the core namespace 
     * and the core interface is not clearly expressed.
     * 
     * https://editor.dev.webgme.org/docs/source/Core.html
     */
    export interface Core {

        /**
         * It adds a project as library to your project by copying it over. 
         * The library will be a node with the given name directly 
         * under your project's ROOT. 
         * It becomes a read-only portion of your project. 
         * You will only be able to manipulate it with library functions, 
         * but cannot edit the individual nodes inside. 
         * However you will be able to instantiate or copy 
         * the nodes into other places of your project. 
         * Every node that was part of the META in the 
         * originating project becomes part of your project's meta.
         * 
         * @param node any regular node in your project.
         * @param name the name of the library you wish to use as a namespace in your project.
         * @param libraryRootHash the hash of your library's root (must exist in the project's collection at the time of call).
         * @param libraryInfo information about your project.
         */
        addLibrary: {
            (node: Core.Node, name: Common.Name, libraryRootHash: string,
                libraryInfo: LibraryInfo, callback: Common.ResultCallback<Core.DataObject>): void;
            (node: Core.Node, name: Common.Name, libraryRootHash: string,
                libraryInfo: LibraryInfo): Promise<Core.DataObject>;
        }
        /**
         * Adds a member to the given set.
         * @param node the owner of the set.
         * @param name the name of the set.
         * @param member the new member of the set.
         * @return If the set is not allowed to be modified, 
         * the function returns an error.
         */
        addMember(node: Core.Node, name: Common.Name, member: Core.Node): undefined | Error;
        /**
         * Adds a mixin to the mixin set of the node.
         * @param node the node in question.
         * @param the path of the mixin node.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        addMixin(node: Core.Node, mixinPath: Common.Path): undefined | Error;
        /**
         * When our attempt to merge two patches ended in some conflict, 
         * then we can modify that result highlighting that in case of every conflict, 
         * which side we prefer (mine vs. theirs). 
         * If we give that object as an input to this function, 
         * it will finish the merge resolving the conflict according 
         * our settings and present a final patch.
         * @param conflict the object that represents our 
         * settings for every conflict and the so-far-merged patch.
         * @return The function results in a tree structured patch 
         * object that contains the changes that cover both 
         * parties modifications 
         * (and the conflicts are resolved according the input settings).
         */
        applyResolution(conflict: {}): {};
        /**
         * Apply changes to the current project.
         * @param root
         * @param patch
         * @return only reports errors.
         */
        applyTreeDiff: {
            (root: Core.Node, patch: Core.DataObject, callback: Common.ResultCallback<Core.DataObject>): void;
            (root: Core.Node, patch: Core.DataObject): Promise<Core.DataObject>;
        }
        /**
         * Checks if the given path can be added as a mixin to the given node.
         * @param node the node in question.
         * @param mixinPath the path of the mixin node.
         * @return Returns if the mixin could be added, or the reason why it is not.
         */
        canSetAsMixin(node: Core.Node, mixinPath: Common.Path): boolean | string;
        /**
         * Removes all META rules that were specifically defined for the node 
         * (so the function do not touches inherited rules).
         * @param node the node in question.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        clearMetaRules(node: Core.Node): undefined | Error;
        /**
         * Removes all mixins for a given node.
         * @param node the node in question.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        clearMixins(node: Core.Node): undefined | Error;
        /**
         * Copies the given node into parent.
         * @param node the node to be copied.
         * @param parent the target parent where the copy will be placed.
         * @return The function returns the copied node or an error if the copy is not allowed.
         */
        copyNode(node: Core.Node, parent: Core.Node): Core.Node | Error;
        /**
         * Copies the given nodes into parent.
         * @param nodes the nodes to be copied.
         * @param parent the target parent where the copies will be placed.
         * @return The function returns an array of the copied nodes or an error 
         * if any of the nodes are not allowed to be copied to the given parent.
         */
        copyNodes(nodes: Core.Node[], parent: Core.Node): Core.Node[] | Error;
        /**
         * Creates a node according to the given parameters.
         * @param parameters the details of the creation.
         * @return The function returns the created node or null if no node was 
         * created or an error if the creation with the given parameters are not allowed.
         */
        createNode(parameters: NodeParameters): Core.Node | Error;
        /**
         * Creates a set for the node.
         * @param node the node that will own the set.
         * @param name the name of the set.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        createSet(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes the given aspect rule of the node.
         * @param node the node whose aspect rule will be deleted.
         * @param name the name of the aspect rule.
         * @return  If the node is not allowed to be modified, the function returns an error.
         */
        delAspectMeta(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes a valid type from the given aspect of the node.
         * @param node the node in question.
         * @param name the name of the aspect rule.
         * @param targetPath the absolute path of the valid type of the aspect.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delAspectMetaTarget(node: Core.Node, name: Common.Name, targetPath: Common.Path): undefined | Error;
        /**
         * Removes the given attributes from the given node.
         * @param node the node in question.
         * @param name the name of the attribute.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delAttribute(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes an attribute definition from the META rules of the node.
         * @param name the node in question.
         * @param name the name of the attribute.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delAttributeMeta(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes the given child rule from the node.
         * @param the node in question.
         * @param childPath the absolute path of the child which rule is to be removed from the node.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delChildMeta(node: Core.Node, childPath: Common.Path): undefined | Error;
        /**
         * Removes a constraint from the node.
         * @param node the node in question.
         * @param name the name of the constraint.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delConstraint(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes a node from the containment hierarchy.
         * It also removes all contained nodes.
         * @param node the node in question.
         * @return If the operation is not allowed it returns an error.
         */
        deleteNode(node: Core.Node): undefined | Error;
        /**
         * Removes the pointer from the node.
         * @param node the node in question.
         * @param name the name of the pointer.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        deletePointer(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes a set from the node.
         * @param node the node in question.
         * @param name the name of the set.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        deleteSet(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes a member from the set. The functions doesn't remove the node itself.
         * @param node the node in question.
         * @param name the name of the set.
         * @param path the path to the member to be removed.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delMember(node: Core.Node, name: Common.Name, path: Common.Path): undefined | Error;
        /**
         * Removes an attribute which represented a property of the given set membership.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param memberPath the path to the member to be removed.
         * @param attrName the name of the attribute.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delMemberAttribute(node: Core.Node, setName: Common.Name, memberPath: Common.Path, attrName: Common.Name): undefined | Error;
        /**
         * Removes a registry entry which represented a property of the given set membership.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param memberPath the path to the member to be removed.
         * @param regName the name of the registry entry.
         * @return If the node is not allowed to be modified, the function returns an error.
         */
        delMemberRegistry(node: Core.Node, setName: Common.Name, memberPath: Common.Path, regName: Common.Name): undefined | Error;
        /**
         * Removes a mixin from the mixin set of the node.
         * @param node the node in question.
         * @param mixinPath the path of the mixin node.
         * @return If the node is not allowed to be modified, the function returns an error. 
         */
        delMixin(node: Core.Node, mixinPath: Common.Path): undefined | Error;
        /**
         * Removes the complete META rule regarding the given pointer/set of the node.
         * @param node the node in question.
         * @param name the name of the pointer/set.
         * @return If the node is not allowed to be modified, the function returns an error. 
         */
        delPointerMeta(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes a possible target type from the pointer/set of the node.
         * @param node the node in question.
         * @param name the name of the pointer/set.
         * @param targetPath the absolute path of the possible target type.
         * @return If the node is not allowed to be modified, the function returns an error. 
         */
        delPointerMetaTarget(node: Core.Node, name: Common.Name, targetPath: string): undefined | Error;
        /**
         * Removes the given registry entry from the given node.
         * @param node the node in question.
         * @param name the name of the registry entry.
         * @return If the node is not allowed to be modified, the function returns an error. 
         */
        delRegistry(node: Core.Node, name: Common.Name): undefined | Error;
        /**
         * Removes the attribute entry for the set at the node.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param attrName the name of the attribute entry.
         * @return If the node is not allowed to be modified, the function returns an error. 
         */
        delSetAttribute(node: Core.Node, setName: Common.Name, attrName: Common.Name): undefined | Error;
        /**
         * Removes the registry entry for the set at the node.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param regName the name of the registry entry.
         * @return If the node is not allowed to be modified, the function returns an error. 
         */
        delSetRegistry(node: Core.Node, setName: Common.Name, regName: Common.Name): undefined | Error;
        /**
         * Generates a differential tree among the two states 
         * of the project that contains the necessary changes 
         * that can modify the source to be identical to the target. 
         * 
         * @param sourceRoot the root node of the source state.
         * @param targetRoot the root node of the target state.
         * @return the result is in form of a json object.
         */
        generateTreeDiff: {
            (sourceRoot: Core.Node, targetRoot: Core.Node, callback: Common.ResultCallback<Core.DataObject>): void;
            (sourceRoot: Core.Node, targetRoot: Core.Node): Promise<Core.DataObject>;
        }
        /**
         * Returns all META nodes.
         * @param node any node of the containment hierarchy.
         * @return the function returns a dictionary. 
         * The keys of the dictionary are the absolute 
         * paths of the META nodes of the project. 
         * Every value of the dictionary is a module:Core~Node.
         */
        getAllMetaNodes(node: Core.Node): Common.Dictionary<Core.Node>;
        /**
         * Returns the list of valid children types of the given aspect.
         * @param node the node in question
         * @param name the name of the aspect.
         * @return the function returns a list of absolute paths 
         * of nodes that are valid children of the node and fits 
         * to the META rules defined for the aspect. 
         * Any children, visible under the given aspect of 
         * the node must be an instance of at least one node 
         * represented by the absolute paths.
         */
        getAspectMeta(node: Core.Node, name: Common.Name): Common.Path[];
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
        getAttribute(node: Core.Node | null, name: Common.Name): Common.OutAttr;
        /**
         * Returns the definition object of an attribute from the META rules of the node.
         * @param node the node in question.
         * @param name the name of the attribute.
         * @return The function returns the definition object, where type is always defined.
         */
        getAttributeMeta(node: Core.Node, name: Common.Name): Common.DefObject;
        /** 
         * Get the defined attribute names for the node.
         * @param node the node in question.
         * @return The function returns an array of the names of the attributes of the node.
         */
        getAttributeNames(node: Core.Node): Common.Name[];
        /** 
         * Get the base node 
         * @param node the node in question.
         * @return the base of the given node or null if there is no such node.
         */
        getBase(node: Core.Node): Core.Node | null;
        /** 
         * Get the base node at the top of the inheritance chain.
         * @param node the node in question.
         * @return the root of the inheritance chain (usually the FCO). 
         */
        getBaseRoot(node: Core.Node): Core.Node;
        /** 
         * Get the most specific meta node;
         * the closest META node of the node in question. 
         * @param node the node in question.
         * @return the first node (including itself) among the 
         * inheritance chain that is a META node. 
         * It returns null if it does not find such node 
         * (ideally the only node with this result is the ROOT).
         */
        getBaseType(node: Core.Node | null): Core.Node | null;
        /** 
         * Get the most specific meta nodes;
         * Searches for the closest META node of the 
         * node in question and the direct mixins of that node. 
         * @param node the node in question.
         * @return the closest Meta node that is a base of the 
         * given node plus it returns all the mixin nodes 
         * associated with the base in a path-node dictionary.
         */
        getBaseTypes(node: Core.Node): Common.Dictionary<Core.Node> | null;
        /**
         * Retrieves the child of the input node at the given relative id.
         * It is not an asynchronous load and it automatically creates 
         * the child under the given relative id if no child was there 
         * beforehand.
         * @param node the node in question.
         * @param relativeId the relative id of the child in question.
         * @return an empty node if it was created as a result 
         * of the function or return the already existing 
         * and loaded node if it found.
         */
        getChild(node: Core.Node, relativeId: string): Core.Node;
        /**
         * Collects the data hash values of the children of the node.
         * @param node the node in question.
         * @return a dictionary of module:Core~ObjectHash that stored in 
         * pair with the relative id of the corresponding child of the node.
         */
        getChildrenHashes(node: Core.Node): Common.Dictionary<Common.MetadataHash>;
        /**
         * Return a JSON representation of the META rules 
         * regarding the valid children of the given node.
         * @param node the node in question.
         * @return a detailed JSON structure that represents the 
         * META rules regarding the possible children of the node.
         */
        getChildrenMeta(node: Core.Node): Core.RelationRule;
        /** 
         * Collects the paths of all the children of the given node.
         * @param node the node in question.
         * @return an array of the absolute paths of the children.
         */
        getChildrenPaths(parent: Core.Node): Common.Path[];
        /**
         * Collects the relative ids of all the children of the given node.
         * @param parent the container node in question.
         * @return an array of the relative ids.
         */
        getChildrenRelids(parent: Core.Node): Common.RelId[];
        /**
         * Retrieves a list of the defined pointer names that has the node as target.
         * @param node the node in question.
         * @return an array of the names of the pointers pointing to the node.
         */
        getCollectionNames(node: Core.Node): string[];
        /**
         * Retrieves a list of absolute paths of nodes that has a 
         * given pointer which points to the given node.
         * @param node the node in question.
         * @param name the name of the pointer.
         * @return an array of absolute paths of nodes having
         *  pointers pointing to the node.
         */
        getCollectionPaths(node: Core.Node, name: Common.Name): Common.Path[];
        /**
         * Gets a constraint object of the node.
         * @param node the node in question.
         * @param name the name of the constraint.
         * @return the defined constraint or null if it was not defined for the node
         */
        getConstraint(node: Core.Node, name: Common.Name): Core.Constraint | null
        /**
         * Retrieves the list of constraint names defined for the node.
         * @param node the node in question.
         * @return the array of names of constraints available for the node.
         */
        getConstraintNames(node: Core.Node): Common.Name[];
        /**
         * Return the root of the inheritance chain of your Meta nodes.
         * @param node the node in question.
         * @return the acting FCO of your project.
         */
        getFCO(node: Core.Node): Core.Node;
        /**
         * @param node the node in question.
         * @return the fully qualified name of the node, 
         * which is the list of its namespaces separated 
         * by dot and followed by the name of the node.
         */
        getFullyQualifiedName(node: Core.Node): Common.Name;
        /**
         * @param node the node in question.
         * @return the globally unique identifier for the node.
         */
        getGuid(node: Core.Node | null): Core.GUID;
        /**
         * Returns the calculated database id of the data of the node.
         * @param node the node in question.
         * @return the so called Hash value of the data of the given node.
         *  If the string is empty, then it means that the 
         *  node was mutated but not yet saved to the database, 
         *  so it does not have a hash temporarily.
         */
        getHash(node: Core.Node): Common.MetadataHash;
        /**
         * Collects the paths of all the instances of the given node.
         * @param node the node in question.
         * @return an array of the absolute paths of the instances.
         */
        getInstancePaths(node: Core.Node): Common.Path[];
        /**
         * Gives a JSON representation of the META rules of the node.
         * @param node the node in question.
         * @return an object that represents all the META rules of the node.
         */
        getJsonMeta(node: Core.Node): Common.MetaRules;
        /**
         * Returns the origin GUID of any library node.
         * @param node the node in question.
         * @param name of the library where we want to deduct the GUID from. 
         * If not given, than the GUID is computed from the 
         * direct library root of the node
         * @return the origin GUID of the node or error if the query cannot be fulfilled.
         */
        getLibraryGuid(node: Core.Node, name: Common.Name | undefined): Core.GUID | Error;
        /**
         * Returns the info associated with the library.
         * @param node the node in question.
         * @param name of the library.
         * @return the information object, stored alongside the library 
         * (that basically carries metaData about the library).
         */
        getLibraryInfo(node: Core.Node, name: Common.Name): LibraryInfo;
        /**
         * Returns all the Meta nodes within the given library. 
         * By default it will include nodes defined in any 
         * library within the given library.
         * @param node the node in question.
         * @param name of the library.
         * @param onlyOwn if true only returns with Meta nodes defined in the library itself.
         * @return an array of core nodes that are part of your meta from the given library.
         */
        getLibraryMetaNodes(node: Core.Node, name: Common.Name, onlyOwn?: boolean): Core.Node[];
        /**
         * Gives back the list of libraries in your project.
         * @param node the node in question.
         * @param name of the library.
         * @param onlyOwn if true only returns with Meta nodes defined in the library itself.
         * @return the fully qualified names of all the 
         * libraries in your project (even embedded ones).
         */
        getLibraryNames(node: Core.Node): Common.Name[];
        /**
         * @param node the node in question.
         * @param name of the library.
         * @return the library root node or null, if the library is unknown.
         */
        getLibraryRoot(node: Core.Node, name: Common.Name): Core.Node | null;
        /**
         * @param node the node in question.
         * @param setName of the set.
         * @param memberPath the absolute path of the member node.
         * @return the value of the attribute. 
         * If it is undefined, 
         * then there is no such attributed connected to the given set membership.
         */
        getMemberAttribute(node: Core.Node, setName: Common.Name,
            memberPath: Common.Path, attrName: Common.Name): Common.OutAttr;
        /**
         * @param node the node in question.
         * @param name of the set.
         * @param memberPath the absolute path of the member node.
         * @return the array of names of attributes that 
         * represents some property of the membership.
         */
        getMemberAttributeNames(node: Core.Node, name: Common.Name, memberPath: Common.Path): string[];
        /**
         * @param node the node in question.
         * @param name of the set.
         * @param memberPath the absolute path of the member node.
         * @return the array of names of attributes that represents some property of the membership.
         */
        getMemberOwnAttributeNames(node: Core.Node, name: Common.Name, memberPath: Common.Path): string[];
        /**
         * @param node the node in question.
         * @param name of the set.
         * @param memberPath the absolute path of the member node.
         * @param regName the name of the registry entry.
         * @return the value of the registry. 
         * If it is undefined, than there is no such registry connected to the given set membership.
         */
        getMemberOwnRegistry(node: Core.Node, name: Common.Name, memberPath: string): Common.OutAttr;
        /**
         * Return the names of the registry entries defined 
         * for the set membership specifically defined to the member node.
         * @param node the node in question.
         * @param name of the set.
         * @param memberPath the absolute path of the member node.
         * @return the array of names of registry entries that represents some property of the membership.
         */
        getMemberOwnRegistryNames(node: Core.Node, name: Common.Name): string[];
        /**
         * Returns the list of absolute paths of the members of the given set of the given node.
         * @param node the node in question.
         * @param name of the set.
         * @return an array of absolute path strings of the member nodes of the set.
         */
        getMemberPaths(node: Core.Node, name: Common.Name): string[];
        /**
         * @param node the node in question.
         * @param setName of the set.
         * @param memberPath the absolute path of the member node.
         * @param regName the name of the registry entry.
         * @return the value of the registry. 
         * If it is undefined, then there is no such registry connected to the given set membership.
         */
        getMemberRegistry(node: Core.Node, setName: string, memberPath: string, regName: string): Common.OutAttr;
        /**
         * @param node the node in question.
         * @param name of the set.
         * @param memberPath the absolute path of the member node.
         * @return the array of names of registry entries that represents some property of the membership.
         */
        getMemberRegistryNames(node: Core.Node, name: Common.Name, memberpath: string): Common.Name[];
        /**
         * Checks if the mixins allocated with the node can be used. 
         * Every mixin node should be on the Meta. 
         * Every rule (attribute/pointer/set/aspect/containment/constraint) 
         * should be defined only in one mixin.
         * @param node the node in question.
         * @return the array of violations. If the array is empty, there are no violations.
         */
        getMixinErrors(node: Core.Node): Core.MixinViolation[];
        /**
         * Gathers the mixin nodes associated with the node.
         * @param node the node in question.
         * @return the dictionary of the mixin nodes keyed by their paths.
         */
        getMixinNodes(node: Core.Node): Common.Dictionary<Core.Node>;
        /**
         * Gathers the paths of the mixin nodes associated with the node.
         * @param node the node in question.
         * @return the paths of the mixins in an array.
         */
        getMixinPaths(node: Core.Node): Common.Path[];
        /**
         * Returns the resolved namespace for the node. 
         * If node is not in a library it returns the empty string. 
         * If the node is in a library of a library - 
         * the full name space is the library names joined together by dots.
         * @param node the node in question.
         * @return the name space of the node.
         */
        getNamespace(node: Core.Node): Common.Name;
        /**
         * @param node the node in question.
         * @return the value of the attribute defined specifically for the node. 
         * If undefined then it means that there is no such 
         * attribute defined directly for the node, 
         * meaning that it either inherits some value or 
         * there is no such attribute at all.
         */
        getOwnAttribute(node: Core.Node, name: Common.Name): Common.OutAttr;
        /**
         * Returns the names of the attributes of the node that have 
         * been first defined for the node and not for its bases.
         * @param node the node in question.
         * @return an array of the names of the own attributes of the node.
         */
        getOwnAttributeNames(node: Core.Node): Common.Name[];
        /**
         * Collects the paths of all the children of the given node 
         * that has some data as well and not just inherited.
         * @param parent the node in question.
         * @return an array of the absolute paths of the children.
         */
        getOwnChildrenPaths(parent: Core.Node): Common.Path[];
        /**
         * Collects the relative ids of all the children 
         * of the given node that has some data and not just inherited. 
         * n.b. Do not mutate the returned array!
         * @param parent the node in question.
         * @return an array of the relative ids.
         */
        getOwnChildrenRelids(parent: Core.Node): Common.RelId[];
        /**
         * Retrieves the list of constraint names defined specifically for the node.
         * @param node the node in question.
         * @return the array of names of constraints for the node.
         */
        getOwnConstraintNames(node: Core.Node): Common.Name[];
        /**
         * Returns the META rules specifically defined for the given node.
         * @param node the node in question.
         * @return an object that represent the META 
         * rules that were defined specifically for the node.
         */
        getOwnJsonMeta(node: Core.Node): Common.MetaRules;
        /**
         * Returns the list of absolute paths of the members of the 
         * given set of the given node that not simply inherited.
         * @param node the node in question.
         * @return an array of absolute path strings of the member nodes of 
         * the set that has information on the node's inheritance level.
         */
        getOwnMemberPaths(node: Core.Node, name: Common.Name): Common.Path[];
        /**
         * Gathers the mixin nodes associated with the node that were defined specifically for the given node.
         * @param node the node in question.
         * @return the dictionary of the own mixin nodes keyed by their paths.
         */
        getOwnMixinNodes(node: Core.Node): Common.Dictionary<Core.Node>;
        /**
         * Gathers the paths of the mixin nodes associated with the node 
         * that were defined specifically for the given node.
         * @param node the node in question.
         * @return the paths of the own mixins in an array.
         */
        getOwnMixinPaths(node: Core.Node): Common.Path[];
        /**
         * Returns the list of the names of the 
         * pointers that were defined specifically for the node.
         * @param node the node in question.
         * @return an array of names of pointers defined specifically for the node.
         */
        getOwnPointerNames(node: Core.Node): Common.Name[];
        /**
         * Returns the absolute path of the target 
         * of the pointer specifically defined for the node.
         * @param node the node in question.
         * @param name the name of the pointer.
         * @return the absolute path. 
         * If the path is null, then it means that 'no-target' 
         * was defined specifically for this node for the pointer. 
         * If undefined it means that the node either inherits 
         * the target of the pointer or there is no pointer defined at all.
         */
        getOwnPointerPath(node: Core.Node, name: Common.Name): Common.OutPath;
        /**
         * Returns the value of the registry entry defined for the given node.
         * @param node the node in question.
         * @param name the name of the registry entry.
         * @return the value of the registry entry defined 
         * specifically for the node. 
         * If undefined then it means that there is no such 
         * registry entry defined directly for the node, 
         * meaning that it either inherits some value 
         * or there is no such registry entry at all.
         */
        getOwnRegistry(node: Core.Node, name: Common.Name): Common.OutAttr;
        /**
         * Returns the names of the registry enrties of the node 
         * that have been first defined for the node and not for its bases.
         * @param node the node in question.
         * @return the value of the registry entry defined 
         * specifically for the node. 
         * If undefined then it means that there is 
         * no such registry entry defined directly for the node, 
         * meaning that it either inherits some value 
         * or there is no such registry entry at all.
         */
        getOwnRegistryNames(node: Core.Node): Common.Name[];
        /**
         * Get the value of the attribute entry 
         * specifically set for the set at the node.
         * @param node the node in question.
         * @return the value of the attribute. 
         * If it is undefined, than there is no such attribute at the set.
         */
        getOwnSetAttribute(node: Core.Node): Common.OutAttr[];
        /**
         * Return the names of the attribute 
         * entries specifically set for the set at the node.
         * @param node the node in question.
         * @return the array of names of attribute entries defined in the set at the node.
         */
        getOwnSetAttributeNames(node: Core.Node): Common.Name[];
        /**
         * Returns the names of the sets created specifically at the node. 
         * n.b. When adding a member to a set of a node, 
         * the set is automatically created at the node.
         * @param node the node in question.
         * @return an array of set names that were specifically created at the node.
         */
        getOwnSetNames(node: Core.Node): Common.Name[];
        /**
         * Get the value of the registry entry specifically set for the set at the node.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param regName the name of the registry entry.
         * @return the value of the registry. 
         * If it is undefined, than there is no such registry at the set.
         */
        getOwnSetRegistry(node: Core.Node, setName: Common.Name, regName: Common.Name): Common.OutAttr[];
        /**
         * Return the names of the registry entries specifically set for the set at the node.
         * @param node the node in question.
         * @param setName the name of the set.
         * @return the array of names of registry entries defined in the set at the node.
         */
        getOwnSetRegistryNames(node: Core.Node, setName: Common.Name): Common.Name[];
        /**
         * Returns the list of the META defined aspect 
         * names of the node that were specifically defined for the node.
         * @param node the node in question.
         * @return the aspect names that are specifically defined for the node.
         */
        getOwnValidAspectNames(node: Core.Node): Common.Name[];
        /**
         * Returns the list of the META defined attribute 
         * names of the node that were specifically defined for the node.
         * @param node the node in question.
         * @return the attribute names that are defined specifically for the node.
         */
        getOwnValidAttributeNames(node: Core.Node): Common.Name[];
        /** 
         * The parent paths are available from the node. 
         * @param node the node in question.
         * @return the parent of the node or NULL if it has no parent.
         */
        getParent(node: Core.Node): Core.Node | null;
        /**  
         * Returns the complete path of the node in the containment hierarchy. 
         * @param node the node in question.
         * @return a path string where each portion is a relative id and they are separated by '/'. 
         * The path can be empty as well if the node in question is the root itself, 
         * otherwise it should be a chain of relative ids from the root of the containment hierarchy.
         */
        getPath(node: Core.Node): Common.Path;
        /**
         * Return a JSON representation of the META rules regarding the given pointer/set of the given node.
         * @param node the node in question.
         * @return a detailed JSON structure that represents the META rules regarding the given pointer/set of the node.
         */
        getPointerMeta(node: Core.Node, name: Common.Name): Core.RelationRule;
        /**
         * Retrieves a list of the defined pointer names of the node.
         * @param node the node in question.
         * @return an array of the names of the pointers of the node.
         */
        getPointerNames(node: Core.Node): Common.Name[];
        /**
         * Retrieves the path of the target of the given pointer of the given node.
         * @param node the node in question.
         * @return the absolute path of the target node if there is a valid target. 
         * It returns null if though the pointer is defined it does not have any valid target. 
         * Finally, it return undefined if there is no pointer defined for the node under the given name.
         */
        getPointerPath(node: Core.Node, name: Common.Name): Common.OutPath;
        /** 
         * Get the assigned registry.
         * Retrieves the value of the given registry entry of the given node. 
         * @param node the node in question.
         * @return the value of the registry entry of the node. 
         * The value can be an object or any primitive type. 
         * If the value is undefined that means the node do not have such attribute defined. 
         * n.b. The retrieved registry value should not be modified as is - it should be copied first!!]
         */
        getRegistry(node: Core.Node, name: Common.Name): Common.OutAttr;
        /** 
         * Get the defined registry names.
         * Returns the names of the defined registry entries of the node.
         * @param node the node in question.
         * @return an array of the names of the registry entries of the node.
         */
        getRegistryNames(node: Core.Node): string[];
        /** 
         * Get the relative id.
         * Returns the parent-relative identifier of the node.
         * @param node the node in question.
         * @return the id string or return NULL and UNDEFINED if there is no such id for the node.
         */
        getRelid(node: Core.Node): Common.RelId | null | undefined;
        /**
         * Returns the root node of the containment tree that node is part of.
         * @param node the node in question.
         * @return the root of the containment hierarchy (it can be the node itself).
         */
        getRoot(node: Core.Node): Core.Node;
        /**
         * Get the value of the attribute entry in the set.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param attrName the name of the attribute entry.
         * @return 
         */
        getSetAttribute(node: Core.Node, setName: Common.Name, attrName: Common.Name): Common.OutAttr;
        /**
         * Return the names of the attribute entries for the set.
         * @param node the node in question.
         * @param setName the name of the set.
         * @return the array of names of attribute entries in the set.
         */
        getSetAttributeNames(node: Core.Node, setName: Common.Name): Common.Name[];
        /**
         * Returns the names of the sets of the node.
         * @param node the node in question.
         * @return an array of set names that the node has.
         */
        getSetNames(node: Core.Node): string[];
        /**
         * Get the value of the registry entry in the set.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param regName the name of the registry entry.
         * @return the value of the registry. If it is undefined, than there is no such registry at the set.
         */
        getSetRegistry(node: Core.Node, setName: Common.Name, regName: Common.Name): Common.OutAttr;
        /**
         * Return the names of the registry entries for the set.
         * @param node the node in question.
         * @param setName the name of the set.
         * @return the array of names of registry entries in the set.
         */
        getSetRegistryNames(node: Core.Node, setName: Common.Name): Common.Name[];

        /**
         * Returns the root of the inheritance chain (cannot be the node itself).
         * @param node the node in question.
         * @return the root of the inheritance chain of the node. 
         * If returns null, that means the node in question is the root of the chain.
         */
        getTypeRoot(node: Core.Node): Core.Node | null;
        /**
         * Returns the list of the META defined aspect names of the node.
         * @param node the node in question.
         * @return all the aspect names that are defined among the META rules of the node.
         */
        getValidAspectNames(node: Core.Node): Common.Name[];
        /**
         * Returns the list of the META defined attribute names of the node.
         * @param node the node in question.
         * @return all the attribute names that are defined among the META rules of the node.
         */
        getValidAttributeNames(node: Core.Node): Common.Name[];
        /**
         * Retrieves the valid META nodes that can be base of a child of the node.
         * @param node the node in question.
         * @return a list of valid nodes that can be instantiated as a child of the node.
         */
        getValidChildrenMetaNodes(parameters: MetaNodeParameters): Core.Node[];
        /**
         * Returns the list of absolute path of the valid children types of the node.
         * @param node the node in question.
         * @return an array of absolute paths of the nodes 
         * that was defined as valid children for the node.
         */
        getValidChildrenPaths(node: Core.Node): Common.Path[];
        /**
         * Returns the list of the META defined pointer names of the node.
         * @param node the node in question.
         * @return all the pointer names that are defined among the META rules of the node.
         */
        getValidPointerNames(node: Core.Node): Common.Name[];
        /**
         * Retrieves the valid META nodes that can be base of a member of the set of the node.
         * @param parameters 
         * @return a list of valid nodes that can be instantiated as a member of the set of the node.
         */
        getValidSetMetaNodes(parameters: MetaSetParameters): Core.Node[];
        /**
         * Returns the list of the META defined set names of the node.
         * @param node the node in question.
         * @return all the set names that are defined among the META rules of the node.
         */
        getValidSetNames(node: Core.Node): Common.Name[];
        /**
         * Checks if the node is abstract.
         * @param node the node in question.
         * @return true if the registry entry 'isAbstract' of the node if true hence the node is abstract.
         */
        isAbstract(node: Core.Node): boolean;
        /** 
         * Check is the node is a connection-like node.
         * Connections are just nodes with two pointers named "src" and "dst". 
         * @param node the node in question.
         * @return true if both the 'src' and 'dst' pointer are defined as valid for the node.
         */
        isConnection(node: Core.Node): boolean;
        /**
         * Checks if the node in question has some actual data.
         * @param node the node in question.
         * @return true if the node is 'empty' meaning that it is not reserved by real data. 
         *  false if the node is exists and have some meaningful value.
         */
        isEmpty(node: Core.Node): boolean;
        /**
         * Checks if the member is completely overridden in the set of the node.
         * @param node the node in question.
         * @param setName the name of the set.
         * @param memberPath the absolute path to the set member.
         * @return true if the member exists in the base of the set, 
         * but was added to the given set as well, which means a complete override. 
         * If the set does not exist or the member do not have 
         * a 'base' member or just some property was overridden, the function returns false.
         */
        isFullyOverriddenMember(node: Core.Node, setName: Common.Name, memberPath: Common.Path): boolean;
        /**
         * Checks if there is a node with the given name in the nodes inheritance chain (excluding itself).
         * @param node the node in question.
         * @param name the name of the class node.
         * @return  true if it finds an ancestor with the given name attribute.
         */
        isInstanceOf(node: Core.Node, name: Common.Name): boolean;
        /**
         * Returns true if the node in question is a library element.
         * @param node the node in question.
         * @return true if your node is a library element, false otherwise.
         */
        isLibraryElement(node: Core.Node): boolean;
        /**
         * Returns true if the node in question is a library root.
         * @param node the node in question.
         * @return true if your node is a library root 
         * (even if it is embedded in other library), false otherwise.
         */
        isLibraryRoot(node: Core.Node): boolean;
        /**
         * Returns all membership information of the given node.
         * @param node the node in question.
         * @return a dictionary where every the key of every entry is an absolute path of a set owner node. 
         * The value of each entry is an array with the set names in which the node can be found as a member.
         */
        isMemberOf(node: Core.Node): Core.DataObject;
        /**
         * Checks if the node is a META node.
         * @param node the node in question.
         * @return true if the node is a member of the 
         * METAAspectSet of the ROOT node hence can be seen as a META node.
         */
        isMetaNode(node: Core.Node): boolean;
        /**
         * Checks if the given typeNode is really a base of the node.
         * @param node the node in question.
         * @param type a candidate base node.
         * @return true if the type is in the inheritance chain of the node or false otherwise. 
         * Every node is type of itself.
         */
        isTypeOf(node: Core.Node, type: Core.Node): boolean;
        /**
         * Checks if the given value is of the necessary type, according to the META rules.
         * @param node the node in question.
         * @param name the name of the attribute.
         * @param value the value for the attribute.
         * @return 
         */
        isValidAttributeValueOf(node: Core.Node, name: Common.Name, value: Common.InAttr): boolean;
        /**
         * Checks if according to the META rules the given node can be a child of the parent.
         * @param node the node in question.
         * @return true if according to the META rules the node can be a child of the parent. 
         * The check does not cover multiplicity 
         * (so if the parent can only have two children and it already has them, 
         * this function will still returns true).
         */
        isValidChildOf(node: Core.Node, parent: Core.Node): boolean;
        /**
         * Checks if base can be the new base of node.
         * @param node the node in question.
         * @param base the new base node.
         * @return true if the supplied base is a valid base for the node.
         */
        isValidNewBase(node: Core.Node, base: Core.Node | null | undefined): boolean;
        /**
         * Checks if parent can be the new parent of node.
         * @param node the node in question.
         * @param parent the new parent.
         * @return true if the supplied parent is a valid parent for the node.
         */
        isValidNewParent(node: Core.Node, parent: Core.Node): boolean;
        /**
         * Returns the list of the META defined pointers of the node.
         * @param node the node in question.
         * @param source the source node to test.
         * @return  true if according to the META rules, 
         * the given node is a valid target of the given pointer of the source.
         */
        isValidTargetOf(node: Core.Node, source: Core.Node, name: Common.Name): boolean;
        /**
         * From the given starting node, it loads the path 
         * given as a series of relative ids (separated by '/') and returns the node it finds at the ends of the path. 
         * If there is no node, the function will return null.
         * @param startNode the starting node of our search.
         * @param relativePath the relative path - built by relative ids - of the node in question.
         */
        loadByPath: {
            (startNode: Core.Node, relativePath: Common.Path, callback: Common.ResultCallback<Common.DataObject>): void;
            (startNode: Core.Node, relativePath: Common.Path): Promise<Common.DataObject>;
        };
        /**
         * Loads the child of the given parent pointed by the relative id. 
         * Behind the scenes, it means that it actually loads the 
         * data pointed by a hash stored inside the parent under 
         * the given id and wraps it in a node object which will 
         * be connected to the parent as a child in the containment hierarchy. 
         * If there is no such relative id reserved, the call will return with null.
         * @param parent the container node in question.
         * @param relativeId the relative id of the child in question.
         */
        loadChild: {
            (parent: Core.Node, relativeId: string, callback: Common.ResultCallback<Common.DataObject[]>): void;
            (parent: Core.Node, relativeId: string): Promise<Common.DataObject[]>;
        };
        /**
         * Loads all the children of the given parent. 
         * As it first checks the already reserved relative ids of the parent, 
         * it only loads the already existing children (so no on-demand empty node creation).
         * @param parent the container node in question.
         * @see https://github.com/webgme/webgme/wiki/GME-Core-API#containment-methods
         */
        loadChildren: {
            (parent: Core.Node, callback: Common.ResultCallback<Common.DataObject[]>): void;
            (parent: Core.Node): Promise<Common.DataObject[]>;
        }
        /**
         * Loads all the source nodes that has such a pointer and its target is the given node.
         * @param target the container node in question.
         * @param pointerName 
         * @return the relative id of the child in question.
         */
        loadCollection: {
            (target: Core.Node, pointerName: Common.Name, callback: Common.ResultCallback<Common.DataObject[]>): void;
            (target: Core.Node, pointerName: Common.Name): Promise<Common.DataObject[]>;
        }
        /**
         * Loads all the instances of the given node.
         * @param node the node in question.
         */
        loadInstances: {
            (node: Core.Node, callback: Common.ErrorOnlyCallback): void;
            (node: Core.Node): Promise<void>;
        }
        /**
         * Loads all the children of the given parent that has some data and not just inherited. 
         * As it first checks the already reserved relative ids of the parent, 
         * it only loads the already existing children (so no on-demand empty node creation).
         * @param parent the container node in question.
         */
        loadOwnChildren: {
            (parent: Core.Node, callback: Common.ErrorOnlyCallback): void;
            (parent: Core.Node): Promise<void>;
        }
        /**
         * Loads a complete sub-tree of the containment hierarchy starting from the given node, 
         * but load only those children that has some additional data and not purely inherited.
         * @param node the node in question.
         */
        loadOwnSubTree: {
            (node: Core.Node, callback: Common.ErrorOnlyCallback): void;
            (node: Core.Node): Promise<void>;
        }
        /**
         * Loads the target of the given pointer of the given node. 
         * In the callback the node can have three values: 
         * if the node is valid, then it is the defined target of a valid pointer, 
         * if the returned value is null, then it means that the pointer is defined, but has no real target, 
         * finally if the returned value is undefined then there is no such pointer defined for the given node.
         * @param source the source node in question.
         * @param pointerName the relative id of the child in question.
         */
        loadPointer: {
            (source: Core.Node, pointerName: string, callback: Common.ResultCallback<Core.DataObject>): void;
            (source: Core.Node, pointerName: string): Promise<Core.DataObject>;
        }
        /**
         * Loads the data object with the given hash and makes it a root of a containment hierarchy.
         * @param node the node in question.
         * @return 
         */
        loadRoot: {
            (metadataHash: Common.MetadataHash, callback: Common.ResultCallback<Core.DataObject>): void;
            (metadataHash: Common.MetadataHash): Promise<Core.DataObject>;
        }
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        loadSubTree: {
            (node: Core.Node, callback: Common.ResultCallback<Core.DataObject>): void;
            (node: Core.Node): Promise<Core.DataObject>;
        }
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        loadTree: {
            (rootHash: Common.MetadataHash, callback: Common.ResultCallback<Core.DataObject>): void;
            (rootHash: Common.MetadataHash): Promise<Core.DataObject>;
        }
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        moveNode(node: Core.Node, parent: Core.Node): Core.Node | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        persist(node: Core.Node): Core.GmePersisted;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        removeLibrary(node: Core.Node, name: Common.Name): void;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        renameLibrary(node: Core.Node, oldName: string, newName: string): void;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setAspectMetaTarget(node: Core.Node, name: Common.Name, target: Core.Node): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setAttribute(node: Core.Node, name: Common.Name, value: Common.InAttr): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setAttributeMeta(node: Core.Node, name: Common.Name, rule: MetaRule): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setBase(node: Core.Node, base: Core.Node): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setChildMeta(node: Core.Node, child: Core.Node, min?: number, max?: number): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setChildrenMetaLimits(node: Core.Node, min?: number, max?: number): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setConstraint(node: Core.Node, name: Common.Name, constraint: Core.Constraint): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setGuid: {
            (node: Core.Node, guid: Core.GUID, callback: Common.ResultCallback<Core.DataObject>): undefined | Error;
            (node: Core.Node, guid: Core.GUID): Promise<Core.DataObject>;
        }
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setMemberAttribute: {
            (node: Core.Node, setName: string, memberPath: string,
                SVGPathSegLinetoHorizontalAbsme: string,
                value?: Common.InAttr): undefined | Error;
        }
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setMemberRegistry(node: Core.Node, setName: string, memberPath: string, regName: string,
            value?: Common.InAttr): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setPointer(node: Core.Node, name: Common.Name, target: Core.Node | null): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setPointerMetaLimits(node: Core.Node, memberPath: string,
            min?: number, max?: number): undefined | Error;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        setPointerMetaTarget(node: Core.Node, name: Common.Name, target: Core.Node, min?: number, max?: number): undefined | Error;
        /** 
         * TODO
         * Get the assigned registry 
         * @param node the node in question.
         * @return 
         */
        setRegistry(node: Core.Node, name: Common.Name, value: Common.InAttr): undefined | Error;
        /**
         * TODO
         * the visitation function will be called for
         * every node in the sub-tree, the second parameter of the function
         * is a callback that should be called to
         * note to the traversal function that the visitation for a given node is finished.
         *  @param node the node in question.
        * @return 
         */
        traverse: {
            // takes a callback & returning *no* promise
            (node: Core.Node,
                options: TraversalOptions,
                visitFn: (node: Core.Node, finished: Common.VoidFn) => void,
                callback: Common.ResultCallback<Core.DataObject>)
                : void;
            // takes *no* callback & returns a promise
            (node: Core.Node,
                options: TraversalOptions,
                visitFn: (node: Core.Node, finished: Common.VoidFn) => void)
                : Promise<void>;
        }
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        tryToConcatChanges(mine: Core.DataObject, theirs: Core.DataObject): Core.DataObject;
        /**
         * TODO
         * @param node the node in question.
         * @return 
         */
        updateLibrary: {
            (node: Core.Node, name: Common.Name, libraryRootHash: Common.MetadataHash,
                libraryInfo: LibraryInfo, callback: Common.ResultCallback<Core.DataObject>): void;
            (node: Core.Node, name: Common.Name, libraryRootHash: Common.MetadataHash,
                libraryInfo: LibraryInfo): Promise<Core.DataObject>;
        }
    }




    export interface ProjectInterface {

    }


    export type ThenCallback = Common.VoidCallback;
    export type CatchCallback = Common.ErrorOnlyCallback;

    export interface Promisable {
        then(callback: ThenCallback): Promisable;
        catch(callback: CatchCallback): Promisable;
    }

    /**
    The base plugin object from which all plugins should inherit.
    */
    export interface Base {

        activeNode: Core.Node;
        activeSelection: Core.Node[];
        blobClient: Blobs.BlobClient;
        core: Core;
        gmeConfig: Config.GmeConfig;
        isConfigured: boolean;
        logger: Global.GmeLogger;
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
         * (n.b. 'a' and 'b' in example 3) are pointing to the meta nodes defined in A.B.)
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
        rootNode: Core.Node;

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
        initialize(logger: Global.GmeLogger, blobClient: Blobs.BlobClient, gmeConfig: Config.GmeConfig): void;
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
        main(callback: Common.ResultCallback<any>): void;
        save(message?: string): Promisable; // returns a promise?
        sendNotification: {
            (message: string, callback: Common.ResultCallback<Core.DataObject>): void;
            (message: string): Promise<Core.DataObject>;
        }
        setCurrentConfig(newConfig: Config.GmeConfig): void;
        updateMeta(generatedMeta: any): void;
        updateSuccess(value: boolean, message: TemplateStringsArray): void;
    }


    export type ProjectStart = string | Storage.CommitHash | string[] | Storage.CommitHash[];
    export type LoadObjectCallback = Storage.CommitObjectCallback;

    export class Project {
        /**
         * Unique ID of project, built up by the ownerId and projectName.
         */
        projectId: string;

        /**
         * Creates a new branch with head pointing to the provided commit hash.
         */
        createBranch: {
            /** Name of branch to create. */
            (branchName: string, newHash: Storage.CommitHash, callback: Storage.CommitResultCallback): void;
            (branchName: string, newHash: Storage.CommitHash, ): Promise<Storage.CommitResult>;
        }
        /**
         * Creates a new tag pointing to the provided commit hash.
         */
        createTag: {
            (tagName: string, commitHash: Storage.CommitHash, callback: Storage.ErrorOnlyCallback): void;
            (tagName: string, commitHash: Storage.CommitHash): Promise<Storage.ErrorOnlyCallback>;
        }
        /**
        * Deletes the given branch.
        */
        deleteBranch: {
            /** Name of branch to delete. */
            (branchName: string, oldHash: Storage.CommitHash, callback: Storage.CommitResultCallback): void;
            (branchName: string, oldHash: Storage.CommitHash, ): Promise<Storage.CommitResult>;
        }
        /**
         * Deletes the given tag.
         */
        deleteTag: {
            /** Name of tag to delete. */
            (tagName: string, callback: Storage.ErrorOnlyCallback): void;
            (tagname: string): Promise<void>;
        }
        /**
         * Retrieves all branches and their current heads within the project.
         */
        getBranches: {
            /** On success the callback will run with Object.module:Storage~CommitHash result. */
            (callback: Storage.CommitHashCallback): void;
            /** On success the promise will be resolved with Object.module:Storage~CommitHash> result. */
            (): Promise<Storage.CommitHash>;
        }
        /**
         * Retrieves the commit hash for the head of the branch.
         */
        getBranchHash: {
            (branchName: string, callback: Storage.CommitHashCallback): void;
            (branchName: string): Promise<Storage.CommitHash>;
        }
        /**
         * Retrieves and array of the latest 
         * (sorted by timestamp) commits for the project. 
         * If timestamp is given it will get number 
         * of commits strictly before before. 
         * If commit hash is specified that 
         * commit will be included too. 
         * n.b. due to slight time differences on different machines, 
         * ancestors may be returned before their descendants. 
         * Unless looking for 'headless' commits 
         * 'getHistory' is the preferred method.
         */
        getCommits: {
            (before: number | Storage.CommitHash, number: number, callback: Storage.CommitObjectCallback): void;
            (before: number | Storage.CommitHash, number: number): Promise<Storage.CommitObject>;
        }
        /**
         * Retrieves the Class ancestor of two commits. 
         * If no ancestor exists it will result in an error.
         */
        getClassAncestorCommit: {
            (commitA: Storage.CommitHash, commitB: Storage.CommitHash, callback: Storage.CommitHashCallback): void;
            (commitA: Storage.CommitHash, commitB: Storage.CommitHash): Promise<Storage.CommitHash>;
        }
        /**
         * Retrieves an array of commits starting from a branch(es) and/or commitHash(es). 
         * The result is ordered by the rules (applied in order) 
         *  1. Descendants are always returned before their ancestors.
         *  2. By their timestamp.
         */
        getHistory: {
            (start: ProjectStart, number: number, callback: Storage.CommitObjectCallback): void;
            (start: ProjectStart, number: number): Promise<Storage.CommitObject>;
        }
        /**
         * Retrieves all tags and their commits hashes within the project.
         */
        getTags: {
            (callback: Storage.CommitHashCallback): void;
            (): Promise<Storage.CommitHash>;
        }

        loadObject: {
            /** Hash of object to load. */
            (key: string, callback: Storage.CommitObjectCallback): void;
            (key: string): Promise<Storage.CommitObject>;
        }
        /** 
         * Collects the objects from the server and pre-loads 
         * them into the cache making the load of multiple objects faster.
         * 
         * @param rootKey Hash of the object at the entry point of the paths.
         * @param paths List of paths that needs to be pre-loaded.
         */
        loadPaths: {
            (rootKey: string, paths: string[], callback: Storage.ErrorOnlyCallback): void;
            (rootKey: string, paths: string[]): Promise<Storage.ErrorOnlyCallback>;
        }

        /**
         * Makes a commit to data base. 
         * Based on the root hash and commit message a 
         * new module:Storage.CommitObject (with returned hash) 
         * is generated and insert together with the 
         * core objects to the database on the server.
         */
        makeCommit: {
            (branchName: string, parents: Storage.CommitHash[],
                rootHash: Core.ObjectHash, coreObjects: Core.DataObject,
                msg: string, callback: Storage.CommitResultCallback): void;
            (branchName: string, parents: Storage.CommitHash[],
                rootHash: Core.ObjectHash, coreObjects: Core.DataObject,
                msg: string): Promise<Storage.CommitResult>;
        }
        /**
         * Updates the head of the branch.
         */
        setBranchHash: {
            (branchName: string, newHash: Storage.CommitHash,
                oldHash: Storage.CommitHash,
                callback: Storage.CommitResultCallback): void;
            (branchName: string, newHash: Storage.CommitHash,
                oldHash: Storage.CommitHash): Promise<Storage.CommitResult>;
        }


    }


}

declare namespace GmePlugin {
    class PluginBase implements Classes.Base {
        constructor();

        activeNode: Core.Node;
        activeSelection: Core.Node[];
        blobClient: Blobs.BlobClient;
        core: Classes.Core;
        gmeConfig: Config.GmeConfig;
        isConfigured: boolean;
        logger: Global.GmeLogger;
        META: any;
        namespace: string;
        notificationHandlers: any[];
        pluginMetadata: Common.Metadata;
        project: Classes.ProjectInterface;
        result: Classes.Result;
        rootNode: Core.Node;

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
        initialize(logger: Global.GmeLogger, blobClient: Blobs.BlobClient, gmeConfig: Config.GmeConfig): void;
        isInvalidActiveNode(pluginId: any): any;
        isMetaTypeOf(node: any, metaNode: any): boolean;
        main(callback: Common.ResultCallback<Classes.Result>): void;
        save(message?: string): Classes.Promisable;
        sendNotification: {
            (message: string, callback: Common.ResultCallback<Classes.Result>): void;
            (message: string): Promise<Core.DataObject>;
        }
        setCurrentConfig(newConfig: Config.GmeConfig): void;
        updateMeta(generatedMeta: any): void;
        updateSuccess(value: boolean, message: TemplateStringsArray): void;
    }

}

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
        _logger: Global.GmeLogger;
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
        logger: Global.GmeLogger;
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
    export type ArtifactHash = string;
    export type Name = string;
    export type NodeId = string;
    export type MemberId = Path;
    export type SetId = string;
    export type Registry = any;
    export type CrosscutsInfo = Registry;

    export type Metadata = { [key: string]: any };
    export type Constraint = string;
    export type AttrMeta = any;
    export type Aspect = string;

    export class Pointer {
        constructor();

        to: Common.NodeId;
        from: Common.NodeId;
    }

    export type Path = string;

    export type DataObject = Core.Node;
    export type Buffer = GLbyte[];
    export type Payload = string | Buffer | Buffer[];
    export type Content = DataObject | Buffer | Buffer[];
    export type ContentString = string;
    export type Primitive = string | number;
    export type OutAttr = DataObject | Primitive | undefined | null;
    export type InAttr = RegObj | Primitive | null;
    export type OutPath = string | undefined | null;

    export interface RegObj {
        x: number;
        y: number;
    }

    export type RelId = string;

    export type VoidFn = () => void;
    export interface DefStringObject {
        type: "string";
        regex?: string;
        enum?: string[];
    }
    export interface DefIntegerObject {
        type: "integer";
        min?: number;
        max?: number;
        enum?: number[];
    }
    export interface DefFloatObject {
        type: "float";
        min?: number;
        max?: number;
        enum?: number[];
    }
    export interface DefBoolObject {
        type: "boolean";
    }
    export interface DefAssetObject {
        type: "asset";
    }
    export type DefObject = DefStringObject
        | DefIntegerObject | DefFloatObject
        | DefBoolObject | DefAssetObject;

    export interface MetaCardRule {
        items: Common.Path[];
        minItems: number[];
        maxItems: number[];
    }
    export interface MetaRules {
        children: MetaCardRule;
        attributes: {
            name: DefStringObject;
            level: DefIntegerObject;
        };
        pointers: {
            ptr: MetaCardRule & {
                min: 1;
                max: 1;
            };
            set: MetaCardRule & {
                min: number;
                max: number;
            };
        };
        aspects: {
            filter: Common.Path[];
        };
        constraints: Common.Dictionary<Core.Constraint>;
    }


    interface VoidCallback {
        (): void;
    }
    interface ErrorOnlyCallback {
        (err: Error | null): void;
    }
    interface ResultCallback<T> {
        (err: Error | null, result: T): void;
    }

    export interface Message {
        msg: string;
    }

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
        context: Core.DataObject;
        contentType: string;
    }

    export type BlobMetadataDescriptor = {}

    export interface BlobClientParamters {
        logger: Global.GmeLogger;
    }
    /**
     * Client to interact with the blob-storage. 
     * https://editor.dev.webgme.org/docs/source/BlobClient.html
     */
    export class BlobClient {
        /**
         * @param paramters
         */
        constructor(parameters: BlobClientParamters);

        /**
         * Creates a new artifact 
         * and adds it to array of artifacts of the instance.
         * @param name name of artifact.
         * @return the created artifact.
         */
        createArtifact(name: Common.Name): Classes.Artifact;
        /**
         * Retrieves the Artifact from the blob storage.
         * @param metadataHash hash associated with the artifact.
         * @return resolved with Artifact artifact.
         */
        getArtifact: {
            (metadataHash: Common.MetadataHash, callback: Common.ResultCallback<Classes.Artifact>): void;
            (metadataHash: Common.MetadataHash): Promise<Classes.Artifact>;
        }
        getMetadataURL(metadataHash: Common.MetadataHash): string;
        getRelativeMetadataURL(metadataHash: Common.MetadataHash): string;
        getViewURL(metadataHash: Common.MetadataHash, subpath: string): string;
        getDownloadURL(metadataHash: Common.MetadataHash, subpath: string): string;
        getRelativeDownloadURL(metadataHash: Common.MetadataHash, subpath: string): string;
        getCreateURL(filename: Common.Name, isMetadata: boolean): string;
        getRelativeCreateURL(filename: Common.Name, isMetadata: boolean): string;
        getSubObject: {
            (metadataHash: Common.MetadataHash, subpath: string, callback: Common.ResultCallback<Core.DataObject>): void;
            (metadataHash: Common.MetadataHash, subpath: string): Promise<Core.DataObject>;
        }
        getObject: {
            (metadataHash: Common.MetadataHash, callback: Common.ResultCallback<Common.Content>, subpath: string): void;
            (metadataHash: Common.MetadataHash, subpath: string): Promise<Common.Content>;
        }
        getObjectAsString: {
            (metadataHash: Common.MetadataHash, callback: Common.ResultCallback<Common.MetadataHash>): Common.ContentString;
            (metadataHash: Common.MetadataHash): Promise<Common.ContentString>;
        }
        getObjectAsJSON: {
            (metadataHash: Common.MetadataHash, callback: Common.ResultCallback<JSON>): void;
            (metadataHash: Common.MetadataHash): Promise<JSON>;
        }
        getMetadata: {
            (metadataHash: Common.MetadataHash, callback: Common.ResultCallback<Common.Metadata>): void;
            (metadataHash: Common.MetadataHash): Promise<Common.Metadata>;
        }
        getHumanSize(bytes: number, si: boolean): string;
        putFile: {
            (name: Common.Name, data: Common.Payload, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (name: Common.Name, data: Common.Payload): Promise<Common.MetadataHash>;
        }
        putMetadata: {
            (metadataDescriptor: BlobMetadataDescriptor, callback: Common.ResultCallback<Common.MetadataHash>): void;
            (metadataDescriptor: BlobMetadataDescriptor): Promise<Common.MetadataHash>;
        }
        putFiles: {
            (o: { [name: string]: Common.Payload }, callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (o: { [name: string]: Common.Payload }): Promise<Common.MetadataHash[]>;
        }
        saveAllArtifacts: {
            (callback: Common.ResultCallback<Common.MetadataHash[]>): void;
            (): Promise<Common.MetadataHash[]>;
        }
    }

}


/**
 * This class defines the public API of the WebGME-Core
 * https://editor.dev.webgme.org/docs/source/module-Core.html
 */
declare namespace Core {

    /**
     * An object that represents some additional rule regarding some node of the project.
     */
    export interface Constraint {
        /** The script which checks if the constraint is met. */
        script: string;
        /** Short description of the constraint. */
        info: string;
        /** Gives instructions on how to deal with violations of the constraint. */
        priority: number;
    }
    /**
     * Inner data of module:Core~Node that can be serialized and saved in the storage.
     */
    export type DataObject = any;

    /** the result object of a persist which contains information about the newly created data objects. */
    export interface GmePersisted {
        rootHash: Core.ObjectHash;
        objects: { [key: string]: Core.DataObject };
    }

    /**
     * Globally unique identifier. 
     * A formatted string containing hexadecimal characters. 
     * If some projects share some GUIDs that can only 
     * be because the node with the given 
     * identification represents the same concept.
     */
    export type GUID = string;

    /**
     * An object that has information about a mixin violation in the given node.
     */
    export interface MixinViolation {
        /** The severity of the given error. */
        severity?: "error" | "warning";
        /** What kind of violation */
        type?: "missing" | "attribute collision" | "set collision"
        | "pointer collision" | "containment collision" | "aspect collision"
        | "constraint collision" | undefined;
        /** The name of the affected rule definition (if available). */
        ruleName?: string | undefined;
        /** The name of the affected rule definition (if available). */
        targetInfo?: string | undefined;
        /** The target node of the violation (if available). */
        targetNode?: Core.Node | undefined;
        /** The list of paths of colliding nodes (if any). */
        collisionPaths?: string[];
        /** The colliding mixin nodes (if any). */
        collisionNodes?: Core.Node[];
        /** The description of the violation. */
        message?: string;
        /** Hint on how to resolve the issue. */
        hint?: string;
    }

    /**
     * The object that represents the atomic element of the containment hierarchy.
    * https://github.com/webgme/webgme/blob/master/src/client/js/client/gmeNodeGetter.js
    */
    export class Node {
        _id: string;
        constructor(id: string, logger: Global.GmeLogger, state: any, storeNode: Common.ResultCallback<Storage>);
        constructor();
        getNode(id: Common.NodeId, logger: Global.GmeLogger, state: any, storeNode: Common.ResultCallback<Storage>): Node;

        getParentId(): Common.NodeId;
        getId(): Common.NodeId;
        getRelid(): Common.RelId;
        getGuid(): GUID;
        getChildrenIds(): Common.NodeId[];
        getBaseId(): Common.NodeId;
        isValidNewBase(basePath: Common.Path): boolean;
        isValidNewParent(parentPath: Common.Path): boolean;
        getInheritorIds(): Common.NodeId[];
        getAttribute(name: Common.Name): Common.OutAttr;
        getOwnAttribute(name: Common.Name): Common.OutAttr;
        getEditableAttribute(name: Common.Name): Common.OutAttr;
        getOwnEditableAttribute(name: Common.Name): Common.OutAttr;
        getRegistry(name: Common.Name): Common.Registry;
        getOwnRegistry(name: Common.Name): Common.Registry;
        getEditableRegistry(name: Common.Name): Common.Registry;
        getOwnEditableRegistry(name: Common.Name): Common.Registry;

        getPointer(name: Common.Name): Common.Pointer;
        getPointerId(name: Common.Name): Common.SetId;
        getOwnPointer(name: Common.Name): Common.Pointer;
        getOwnPointerId(name: Common.Name): Common.SetId;
        getPointerNames(): Common.Name[];
        getOwnPointerNames(): Common.Name[];

        getAttributeNames(): Common.Name[];
        getValidAttributeNames(): Common.Name[];
        getOwnAttributeNames(): Common.Name[];
        getOwnValidAttributeNames(): Common.Name[];

        getAttributeMeta(name: Common.Name): Common.AttrMeta;
        getRegistryNames(): Common.Name[];
        getOwnRegistryNames(): Common.Name[];

        /** Set */
        getMemberIds(setId: Common.SetId): Common.Path[];
        getSetNames(): Common.Name[];
        getMemberAttributeNames(setId: Common.SetId, memberId: Common.MemberId): Common.Name[];
        getMemberAttribute(setId: Common.SetId, memberId: Common.MemberId): Common.OutAttr;
        getEditableMemberAttribute(setId: Common.SetId, memberId: Common.MemberId, name: Common.Name): Common.OutAttr;
        getMemberRegistryNames(setId: Common.SetId, memberId: Common.MemberId): Common.Name[];
        getMemberRegistry(setId: Common.SetId, memberId: Common.MemberId, name: Common.Name): Common.Registry;
        getEditableMemberRegistry(setId: Common.SetId, memberId: Common.MemberId, name: Common.Name): Common.Registry;

        /** META */
        getValidChildrenTypes(): Common.NodeId[];
        getValildAttributeNames(): Common.Name[];
        isValidAttributeValueOf(name: Common.Name, value: any): boolean;
        getValidPointerNames(): Common.Name[];
        getValidSetNames(): Common.Name[];
        getConstraintNames(): Common.Name[];
        getOwnConstraintNames(): Common.Name[];
        getConstraint(name: Common.Name): Constraint;
        toString(): string;

        getCollectionPaths(name: Common.Name): Common.Path[];
        getInstancePaths(): Common.Path[];
        getJsonMeta(): Common.Metadata[];

        isConnection(): boolean;
        isAbstract(): boolean;
        isLibraryRoot(): boolean;
        isLibraryElement(): boolean;
        getFullyQualifiedName(): Common.Name;
        getNamespace(): Common.Name;

        getLibraryGuid(): GUID;
        getCrosscutsInfo(): Common.CrosscutsInfo;
        getValidChildrenTypesDetailed(aspect: Common.Aspect, noFilter: boolean): Common.Dictionary<any>;
        getValidSetMemberTypesDetailed(setName: Common.Name): { [key: string]: any };
        getMetaTypeId(): Node | null;
        getBaseTypeId(): Node | null;
        isMetaNode(): boolean;
        isTypeOf(typePath: Common.Path): boolean;
        isValidChildOf(parentPath: Common.Path): boolean;
        getValidChildrenIds(): Common.NodeId[];
        isValidTargetOf(sourcePath: Common.Path, name: Common.Name): boolean;
        getValidAspectNames(): Common.Name[];
        getOwnValidAspectNames(): Common.Name[];
        getAspectMeta(): Common.Metadata;

        /** MixIns */
        getMixinPaths(): Common.Path[];
        canSetAsMixin(mixinPath: Common.Path): boolean;
        isReadOnly(): boolean;

    }

    /** 
     * Unique SHA-1 hash for the node object.
     */
    export type ObjectHash = string;

    /**
     * An object that represents a relational type rule-set (pointer/set).
     */
    export interface RelationRuleDetail {
        /** 
         * The minimum amount of target necessary for the relationship 
         * (if not present or '-1' then there is no minimum rule that applies) 
         */
        min?: number;
        /** 
         * The maximum amount of target necessary for the relationship 
         * (if not present or '-1' then there is no maximum rule that applies) 
         */
        max?: number;
    }
    /**
     * special rules regarding the given type (if the object is empty, it still represents that the type is a valid target of the relationship)
     */
    export interface RelationRuleDictionary {
        [absolutePathOfTarget: string]: RelationRuleDetail;
    }
    export type RelationRule = RelationRuleDetail & RelationRuleDictionary;
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
        core: Classes.Core;
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

declare namespace Storage {
    export interface ErrorOnlyCallback {
        (err: Error | null): void;
    }
    export interface CommitHashCallback {
        (err: Error | null, result: CommitHash): void;
    }
    export type CommitHash = string;


    export interface CommitObject {
        /**
         * Hash of the commit object, a.k.a commitHash.
         */
        _id: Storage.CommitHash;
        /**
         * Hash of the associated root object, a.k.a. rootHash.
         */
        root: Core.ObjectHash;
        /**
         * Commits from where this commit evolved.
         */
        parents: Storage.CommitHash[];
        /**
         * When the commit object was created (new Date()).getTime().
         */
        time: number;
        /**
         * Commit message.
         */
        message: string;
        /**
         * Who performed the update.
         */
        updater: string[];
        /**
         * A constant 'commit'.
         */
        type: string;
    }

    export interface CommitObjectCallback {
        (err: Error | null, result: CommitObject): void;
    }

    export interface CommitResult {
        /** The commitHash for the commit. */
        hash: CommitHash;
        status: "SYNCED" | "FORKED" | "CANCELED" | undefined;
    }
    export interface CommitResultCallback {
        (err: Error | null, result: CommitResult): void;
    }
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
        relids: Common.RelId[];
        metaSheets: any;
    }
}