class Boid {
    constructor(){
        this.position = createVector(random(width), random(height));
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 3;
    }

    edges(){
        if(this.position.x > width){
            this.position.x = 0;
        }
        else if (this.position.x < 0){
            this.position.x = width;
        }

        if(this.position.y > height){
            this.position.y = 0;
        }
        else if (this.position.y < 0){
            this.position.y = height;
        }
    }
    
    align(boids){ 
        let vision = 50;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            let d = sqrt(pow(min(abs(this.position.x - other.position.x), width - abs(this.position.x - other.position.x)), 2) 
            + pow(min(abs(this.position.y - other.position.y), height - abs(this.position.y - other.position.y)), 2));

            if(other != this && d < vision) {
                steering.add(other.velocity);
                total++;
            }
        }
        if(total > 0){
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids){ 
        let vision = 50;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            let d = sqrt(pow(min(abs(this.position.x - other.position.x), width - abs(this.position.x - other.position.x)), 2) 
            + pow(min(abs(this.position.y - other.position.y), height - abs(this.position.y - other.position.y)), 2));

            if(other != this && d < vision) {
                steering.add(other.position);
                total++;
            }
        }
        if(total > 0){
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    seperation(boids){ 
        let vision = 50;
        let steering = createVector();
        let total = 0;
        for(let other of boids){
            let d = sqrt(pow(min(abs(this.position.x - other.position.x), width - abs(this.position.x - other.position.x)), 2) 
            + pow(min(abs(this.position.y - other.position.y), height - abs(this.position.y - other.position.y)), 2));

            if(other != this && d < vision) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d^2);
                steering.add(diff);
                total++;
            }
        }
        if(total > 0){
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids){
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let seperation = this.seperation(boids);

        seperation.mult(seperationSlider.value());
        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(seperation);

    }

    update(){
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    show(){
        strokeWeight(8);
        stroke(25);
        point(this.position.x, this.position.y);
    }
}