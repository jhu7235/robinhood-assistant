import { app } from '../app';

import chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import robinhood from '../robinhood/robinhood';

const expect = chai.expect;

describe('app', () => {
  const sinonSandbox = sinon.createSandbox();
  let getUserSpy: sinon.SinonSpy;
  beforeEach(() => {
    getUserSpy = sinonSandbox.stub(robinhood, 'getUser')
      .returns(Promise.resolve('fake user') as any);
  });
  afterEach(() => sinonSandbox.restore());

  describe('GET /', () => {
    it('should get user', async () => {
      await request(app).get('/user').expect(200, '"fake user"');
      expect(getUserSpy.called).to.equal(true);
    });

    // not testing anything else since there is no logic in the router
  });
});
