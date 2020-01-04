import 'mocha';
import { expect } from 'chai';
import { stub, SinonStubbedInstance } from 'sinon';
import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';

import Types from '../../core/ioc/types';
import Container from '../../core/ioc/container';
import IDirectoryService from '../../core/interface/io/directory/directory-service.interface';

import DirectorySelectionStore from './directory-selection-store';

createLocalVue().use(Vuex);

context('directory selection store unit test', () => {
    let store: Store<any>;
    let directoryServiceStub: SinonStubbedInstance<IDirectoryService>;

    beforeEach('stub setup', () => {
        Container.snapshot();

        directoryServiceStub = stub({
            async listDirectoryFlat() { return []; },
            async listDirectoryRecursive() { return []; },
            async isDirectory() { return false; }
        } as IDirectoryService);

        Container
            .rebind<IDirectoryService>(Types.IDirectoryService)
            .toConstantValue(directoryServiceStub);
    });

    beforeEach('test setup', () => {
        store = new Store(DirectorySelectionStore());
    });

    afterEach('test teardown', () => {
        Container.restore();
    });

    describe('loadItems', () => {
        it('should return all loaded items', async () => {
            const expected = [
                { name: 'file_1', children: null },
                { name: 'file_2', children: null }
            ];

            directoryServiceStub.listDirectoryRecursive.resolves(expected);

            const result = await store.dispatch('loadItems', '');

            expect(result).to.deep.equal(expected);
        });

        it('should reset selected item', async () => {
            store.state.selected = { isFocused: true };

            await store.dispatch('loadItems', '');

            expect(store.state.selected).to.be.null;
        });
    });

    describe('selectItem', () => {
        it('should set selected item and set current item to focused', () => {
            const item = { isFocused: false };

            store.dispatch('selectItem', item);

            expect(store.state.selected).to.equal(item);
            expect(item.isFocused).to.be.true;
        });

        it('should set selected item and set previous item to unfocused', () => {
            const previousItem = { isFocused: true };
            const currentItem = { isFocused: false };
            store.state.selected = previousItem;

            store.dispatch('selectItem', currentItem);

            expect(store.state.selected).to.equal(currentItem);
            expect(previousItem.isFocused).to.be.false;
            expect(currentItem.isFocused).to.be.true;
        });

        it('should set selected item to null when input is null', () => {
            store.dispatch('selectItem', null);

            expect(store.state.selected).to.be.null;
        });
    });
});
