export const schema = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'type': 'object',
    'properties': {
        'pulls': {
            'type': 'object',
            'properties': {
                'labels': {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'label': {
                                'type': 'object',
                                'properties': {
                                    'name': {
                                        'type': 'string'
                                    },
                                    'add': {
                                        'type': 'array',
                                        'items': {
                                            'type': 'object',
                                            'properties': {
                                                'when': {
                                                    'type': 'object',
                                                    'properties': {
                                                        'statuses': {
                                                            'type': 'object'
                                                        },
                                                        'notLabeled': {
                                                            'type': 'array',
                                                            'items': {
                                                                'type': 'string'
                                                            }
                                                        },
                                                        'canBeMerged': {
                                                            'type': 'boolean'
                                                        },
                                                        'reviewRequestChange': {
                                                            'type': 'boolean'
                                                        },
                                                        'labeled': {
                                                            'type': 'array',
                                                            'items': {
                                                                'type': 'string'
                                                            }
                                                        },
                                                        'reviewResponseToRequestChange': {
                                                            'type': 'boolean'
                                                        },
                                                        'onPush': {
                                                            'type': 'boolean'
                                                        },
                                                        'reviewApproved': {
                                                            'type': 'boolean'
                                                        }
                                                    }
                                                }
                                            },
                                            'required': [
                                                'when'
                                            ]
                                        }
                                    },
                                    'remove': {
                                        'type': 'array',
                                        'items': {
                                            'type': 'object',
                                            'properties': {
                                                'when': {
                                                    'type': 'object',
                                                    'properties': {
                                                        'statuses': {
                                                            'type': 'object'
                                                        },
                                                        'notLabeled': {
                                                            'type': 'array',
                                                            'items': {
                                                                'type': 'string'
                                                            }
                                                        },
                                                        'canBeMerged': {
                                                            'type': 'boolean'
                                                        },
                                                        'reviewRequestChange': {
                                                            'type': 'boolean'
                                                        },
                                                        'labeled': {
                                                            'type': 'array',
                                                            'items': {
                                                                'type': 'string'
                                                            }
                                                        },
                                                        'reviewResponseToRequestChange': {
                                                            'type': 'boolean'
                                                        },
                                                        'onPush': {
                                                            'type': 'boolean'
                                                        },
                                                        'reviewApproved': {
                                                            'type': 'boolean'
                                                        }
                                                    }
                                                }
                                            },
                                            'required': [
                                                'when'
                                            ]
                                        }
                                    }
                                },
                                'required': [
                                    'name',
                                    'add',
                                    'remove'
                                ]
                            }
                        },
                        'required': [
                            'label'
                        ]
                    }
                }
            },
            'required': [
                'labels'
            ]
        }
    },
    'required': [
        'pulls'
    ]
} as const;

export default schema;
