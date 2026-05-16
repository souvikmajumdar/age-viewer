import assert from 'node:assert';
import { toAgeProps } from '../src/util/ObjectExtras.js';

describe('object serialize', ()=>{
    it('serialize basic', ()=>{
        let serial = toAgeProps({'id':2,'name':'hi'});
        assert.equal(serial, "{id:2, name:'hi'}");
    });
});
