require('dotenv').config();

const nock = require('nock');
const sandbox = require("sinon").createSandbox();

// Mocked Activity Details
const { activity_details: activityDetailsStub } = require('./mockdata/activityDetails');

const { Client } = require('yoti');

const {
  SandboxProfileClientBuilder,
  SandboxExtraDataBuilder,
  SandboxAttributeIssuanceDetailsBuilder,
  SandboxDocumentImagesBuilder,
  TokenRequestBuilder,
} = require('@getyoti/sdk-sandbox');

const fs = require('fs');

const config = {
  SANDBOX_CLIENT_SDK_ID: process.env.YOTI_SANDBOX_CLIENT_SDK_ID,
  SANDBOX_API_URL: process.env.YOTI_API_URL,
  PEM: fs.readFileSync(process.env.YOTI_KEY_FILE_PATH, 'utf8'),
};

const yotiClient = new Client(
  config.SANDBOX_CLIENT_SDK_ID,
  config.PEM
);

// Mock the Token API request
const nockToken = () => {
  nock(config.SANDBOX_API_URL)
    .post(`/apps/${config.SANDBOX_CLIENT_SDK_ID}/tokens`)
    .query(true)
    .reply(200, {
      token: '12345',
    });
};

describe('Sandbox Offline Example', () => {

  // Replace actual method with mocked method stub
  beforeEach(function () {
    sandbox.replace(yotiClient, "getActivityDetails", activityDetailsStub);
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should return a mocked user profile', async () => {

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    const dataEntry = new SandboxAttributeIssuanceDetailsBuilder()
      .withIssuanceToken('some-token')
      .withDefinition('some-definition')
      .withExpiryDate(expiryDate)
      .build();

    const extraData = new SandboxExtraDataBuilder()
      .withDataEntry(dataEntry)
      .build();

    const documentImages = new SandboxDocumentImagesBuilder()
      .withJpegContent(Buffer.from('some-jpeg'))
      .build();

    const tokenRequest = new TokenRequestBuilder()
      .withRememberMeId('Some Remember Me ID')
      .withFullName('Some Full Name')
      .withDateOfBirthString('1990-01-01')
      .withGender('Some Gender')
      .withEmailAddress('some@email.address')
      .withBase64Selfie(Buffer.from('Some Selfie').toString('base64'))
      .withDocumentDetails('PASSPORT GBR USER9901010Y99SR01')
      .withDocumentImages(documentImages)
      .withExtraData(extraData)
      .build();

    const sandboxProfileClient = new SandboxProfileClientBuilder()
      .withClientSdkId(config.SANDBOX_CLIENT_SDK_ID)
      .withPemString(config.PEM)
      .build();

    // Intercept the actual API request
    nockToken();

    const tokenResponse = await sandboxProfileClient.setupSharingProfile(tokenRequest);
    const token = tokenResponse.getToken();

    const activityDetails = await yotiClient.getActivityDetails(token);

    const profile = activityDetails.getProfile();

    expect(Buffer.from(activityDetails.getRememberMeId()).toString())
      .toBe('Some Remember Me ID');

    expect(profile.getFullName().getValue()).toEqual('Some Full Name');
    expect(profile.getDateOfBirth().getValue()).toEqual('1990-01-01');
    expect(profile.getEmailAddress().getValue()).toEqual('some@email.address');
    expect(profile.getDocumentImages().getValue()).toHaveLength(1);
    expect(profile.getSelfie().getValue().getBase64Content())
      .toEqual('data:image/jpeg;base64,' + Buffer.from('Some Selfie').toString('base64'));

    const documentDetails = profile.getDocumentDetails().getValue();
    expect(documentDetails.getType())
      .toEqual('PASSPORT');
    expect(documentDetails.getIssuingCountry())
      .toEqual('GBR');
    expect(documentDetails.getDocumentNumber())
      .toEqual('USER9901010Y99SR01');

    const attributeIssuanceDetails = activityDetails.getExtraData().getAttributeIssuanceDetails();
    expect(attributeIssuanceDetails.getToken())
      .toEqual('some-token');
    expect(attributeIssuanceDetails.getExpiryDate().getTime())
      .toEqual('some-expiry-date');
    expect(attributeIssuanceDetails.getIssuingAttributes()[0].getName())
      .toEqual('some-definition');
  });
});
