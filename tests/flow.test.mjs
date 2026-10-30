import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, reducer as r, createAuthorizationAction } from '../src/flow.js';
for (const scenario of ['H5','App','Web']) for(const loggedIn of [false,true]) for(const wakeFails of scenario==='App'?[false,true]:[false]) {
 test(`${scenario} / ${loggedIn?'已登录':'未登录'} / ${wakeFails?'兜底':'正常'}`,()=>{
 let s=r(r(r(initialState,{type:'scenario',value:scenario}),{type:'session',value:loggedIn}),{type:'wake',value:wakeFails});
 s=r(s,{type:'start'});
 if(scenario==='App'){assert.equal(s.stage,'launching');s=r(s,{type:'launched'});if(wakeFails){assert.equal(s.stage,'failure');assert.equal(r(s,{type:'cancel'}).result,'cancelled');s=r(s,{type:'fallback'});assert.equal(s.fallback,true)}}
 assert.equal(s.stage,loggedIn?'consent':'login');
 if(!loggedIn){assert.equal(r(s,{type:'authorize'}).stage,'login');s=r(s,{type:'login',account:'bad',password:'bad'});assert.ok(s.error);assert.equal(s.stage,'login');s=r(s,{type:'login',account:'harry',password:'123456'});assert.equal(s.error,'')}
 assert.equal(s.stage,'consent');const failed=r(s,createAuthorizationAction(()=>0.1));assert.equal(failed.stage,'home');assert.equal(failed.result,'failed');assert.equal(failed.fallback,false);assert.equal(r(failed,{type:'reset'}).result,null);const cancelled=r(s,{type:'cancel'});assert.equal(cancelled.stage,'home');assert.equal(cancelled.result,'cancelled');
 s=r(s,createAuthorizationAction(()=>0.8));assert.equal(s.stage,'home');assert.equal(s.scenario,scenario);assert.equal(s.result,'success');
 s=r(s,{type:'reset'});assert.equal(s.result,null);assert.equal(s.stage,'home');assert.equal(s.loggedIn,loggedIn);assert.equal(s.fallback,false);
 s=r(s,{type:'start'});if(scenario==='App'){s=r(s,{type:'launched'});if(wakeFails)s=r(s,{type:'fallback'})}assert.notEqual(s.result,'success');assert.equal(s.stage,loggedIn?'consent':'login');
 s=r(s,{type:'scenario',value:'Web'});assert.equal(s.stage,'home');assert.equal(s.fallback,false);assert.equal(s.error,'');assert.equal(s.result,null);
 s=r(s,{type:'session',value:!loggedIn});assert.equal(s.loggedIn,!loggedIn);assert.equal(s.stage,'home');
 });
}

test('确认授权按 30% 阈值失败，每次操作只采样一次',()=>{
 for(const [sample,failed] of [[0,true],[0.299999,true],[0.3,false],[0.999999,false]]){
  let calls=0;const action=createAuthorizationAction(()=>{calls++;return sample});assert.equal(calls,1);assert.equal(action.type,'authorize');assert.equal(action.failed,failed);
 }
 assert.equal(Array.from({length:1000},(_,i)=>createAuthorizationAction(()=>i/1000)).filter(action=>action.failed).length,300);
 assert.equal(r(initialState,createAuthorizationAction(()=>0)).stage,'home');
});
