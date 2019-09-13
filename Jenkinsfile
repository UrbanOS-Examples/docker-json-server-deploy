library(
    identifier: 'pipeline-lib@4.6.1',
    retriever: modernSCM([$class: 'GitSCMSource',
                          remote: 'https://github.com/SmartColumbusOS/pipeline-lib',
                          credentialsId: 'jenkins-github-user'])
)

properties([
    pipelineTriggers([scos.dailyBuildTrigger()]),
    parameters([
        booleanParam(defaultValue: false, description: 'Deploy to development environment?', name: 'DEV_DEPLOYMENT'),
        string(defaultValue: 'development', description: 'Image tag to deploy to dev environment', name: 'DEV_IMAGE_TAG')
    ])
])

def doStageIf = scos.&doStageIf
def doStageIfDeployingToDev = doStageIf.curry(env.DEV_DEPLOYMENT == "true")
def doStageIfMergedToMaster = doStageIf.curry(scos.changeset.isMaster && env.DEV_DEPLOYMENT == "false")
def doStageIfRelease = doStageIf.curry(scos.changeset.isRelease)

node ('infrastructure') {
    ansiColor('xterm') {
        scos.doCheckoutStage()
        //REALLY COOL COMMENT TO TEST PR BUILDS
        doStageIfDeployingToDev('Deploy to Dev') {
            deployTo('dev', "--recreate-pods")
        }

        doStageIfMergedToMaster('Deploy to Staging') {
            deployTo('staging')
        }

        doStageIfRelease('Deploy to Production') {
            deployTo('prod')
        }
    }
}

def deployTo(environment, extraArgs = '') {
    scos.withEksCredentials(environment) {
        sh("""#!/bin/bash
            set -e
            helm init --client-only
            helm upgrade --install json-server docker-json-server \
                --namespace=testing \
                ${extraArgs}
        """.trim())
    }
}