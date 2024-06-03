pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20.14.0' // Ensure this matches the name you configured in Jenkins
    }

    environment {
        DEPLOY_SERVER = '10.187.70.106'
        DEPLOY_USER = 'ubuntu'
        DEPLOY_PATH = '/home/ubuntu/jenkins/express-app'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/Yuva-aj/to-do/', branch: 'main' // Specify the branch if it's not the default branch
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        // stage('Run Tests') {
        //     steps {
        //         sh 'npm test'
        //     }
        // }
        // stage('Build') {
        //     steps {
        //         sh 'npm run build' // If you have a build script
        //     }
        // }
        stage('Deploy') {
            steps {
                // Use Jenkins credentials for secure access
                sshagent(['agent1']) {
                    // sh "scp -r . ${DEPLOY_USER}@${DEPLOY_SERVER}:${DEPLOY_PATH}"
                    sh "scp -r . ubuntu@10.187.70.106:/home/ubuntu/jenkins/express-app"
                }
            }
        }
    }
}
