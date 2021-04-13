pipeline {
  agent any

  environment{
    CI = false
    DOCKER_TAG = getDockerTag()
  }

  stages {
    
    stage ('Install Dependencies rigup project'){
      steps{
        echo "Starts install dependencies rigup project"
        sh "npm install"
      }
    }

    //stage dua
    stage ('Test project'){
      steps{
        echo "run test script"    
        // sh 'chmod +x jenkins/scripts/test.sh'
        // sh './jenkins/scripts/test.sh'
      }
    } 

    //stage tiga
    stage ('Build rigup project'){
      steps{    
        sh 'npm run build'
      }
    } 

    //stage empat
    stage ('Build docker images'){
      steps{    
        script {
          app = docker.build("yosafatdeny/rigup_frontend") 
        }    
      }
    }

    // //stage lima
    // stage ('test docker images'){
    //   steps{    
    //     sh 'docker run -d --rm --name testimage -p 8081:80 yosafatdeny/reactapp-jcde'   
    //     //input message: "Finished test image? (Click procced to continue)"
    //   }      
    // } 

    // //stage enam
    // stage ('clean up docker test'){
    //   steps{    
    //     sh 'docker stop testimage'    
    //   }    
    // }   

    //stage tujuh
    stage ('push image to registry'){
      steps{    
        script{
          docker.withRegistry("https://registry.hub.docker.com", "credentials-docker"){
            app.push("${DOCKER_TAG}")
            app.push("latest")    
          }    
        }    
      }    
    }  

    // //stage delapan
    // stage ('clean up docker images'){
    //   steps{    
    //     sh 'docker rmi yosafatdeny/reactapp-jcde:latest'    
    //   }    
    // } 

    //stage sembilan
    stage ('deploy app to kubernetes cluster'){
      steps{    
        sh "chmod +x changeTag.sh"
        sh "./changeTag.sh ${DOCKER_TAG}"
        withKubeConfig([credentialsId: 'kubeconfig-rigup', serverUrl: 'https://34.101.71.208']){
          sh 'kubectl apply -f rigup-config.k8s.yaml'    
        }      
      }    
    }
  }      
}

def getDockerTag(){
  def tag = sh script: "git rev-parse HEAD", returnStdout: true
  return tag    
}