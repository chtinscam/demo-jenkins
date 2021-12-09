pipeline {
        agent any 
        stages {
            stage('Clone') {
                steps {
                   git branch: 'main', url: 'https://github.com/chtinscam/demo-jenkins.git'
                }
            }
        }
}