pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20.14.0' // Ensure this matches the name you configured in Jenkins
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Yuva-aj/to-do/'
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
                sh 'scp -r . ubuntu@10.6.71.228:/home'
            }
        }
    }
}
