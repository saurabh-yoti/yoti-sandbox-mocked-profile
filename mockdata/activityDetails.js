exports.activity_details = () => {
    return {
        rememberMeId: 'Some Remember Me ID',
        profile: {
            fullName: {
                value: 'Some Full Name',
                getValue() {
                    return this.value;
                },
            },
            dateOfBirth: {
                value: '1990-01-01',
                getValue() {
                    return this.value;
                },
            },
            gender: {
                value: 'Some Gender',
                getValue() {
                    return this.value;
                },
            },
            emailAddress: {
                value: 'some@email.address',
                getValue() {
                    return this.value;
                },
            },
            selfie: {
                value:
                {
                    base64Content: 'data:image/jpeg;base64,' + Buffer.from('Some Selfie').toString('base64'),
                    getBase64Content() {
                        return this.base64Content;
                    },
                },
                getValue() {
                    return this.value;
                },
            },
            documentImages: {
                value: [
                    {
                        base64Content: 'data:image/jpeg;base64,' + Buffer.from('Some Selfie').toString('base64'),
                        getBase64Content() {
                            return this.base64Content;
                        },
                    },
                ],
                getValue() {
                    return this.value;
                },
            },
            documentDetails: {
                value: {
                    documentNumber: 'USER9901010Y99SR01',
                    documentType: 'PASSPORT',
                    issuingCountry: 'GBR',
                    expirationDate: new Date('2024-02-02'),
                    getDocumentNumber() {
                        return this.documentNumber;
                    },
                    getType() {
                        return this.documentType;
                    },
                    getIssuingCountry() {
                        return this.issuingCountry;
                    },
                    getExpirationDate() {
                        return new Date(this.expirationDate);
                    },
                },
                getValue() {
                    return this.value;
                },
            },
            getFullName() {
                return this.fullName;
            },
            getDateOfBirth() {
                return this.dateOfBirth;
            },
            getGender() {
                return this.gender;
            },
            getEmailAddress() {
                return this.emailAddress;
            },
            getSelfie() {
                return this.selfie;
            },
            getDocumentImages() {
                return this.documentImages;
            },
            getDocumentDetails() {
                return this.documentDetails;
            },
        },
        extraData: {
            attributeIssuanceDetails: {
                token: 'some-token',
                expiryDate: {
                    time: 'some-expiry-date',
                    getTime() {
                        return this.time;
                    },
                },
                issuingAttributes: [
                    {
                        name: 'some-definition',
                        getName() {
                            return this.name;
                        },
                    }
                ],
                getToken() {
                    return this.token;
                },
                getExpiryDate() {
                    return this.expiryDate;
                },
                getIssuingAttributes() {
                    return this.issuingAttributes;
                }
            },
            getAttributeIssuanceDetails() {
                return this.attributeIssuanceDetails;
            },
        },
        getRememberMeId() {
            return this.rememberMeId;
        },
        getProfile() {
            return this.profile;
        },
        getExtraData() {
            return this.extraData;
        },
    };
};
