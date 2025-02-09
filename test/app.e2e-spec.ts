import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Doctor,Category} from '../src/doctor/schemas/doctor.schema';
import { User } from '../src/auth/schemas/user.schema';

describe('Doctor & Auth Controller (e2e)', () => {
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sequelize = moduleFixture.get<Sequelize>(Sequelize);
    await sequelize.sync({ force: true }); // Reset database for tests
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const user = {
    name: 'test',
    email: 'test@gmail.com',
    password: '12345678',
  };

  const newDoctor = {
    name: 'New Doctor',
    category: Category.CARDIOLOGIST,
  };

  let jwtToken: string = '';
  let doctorCreated: Doctor;

  describe('Auth', () => {
    it('(POST) - Register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });

    it('(POST) - Login user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });
  });

  describe('Doctor', () => {
    it('(POST) - Create new Doctor', async () => {
      return request(app.getHttpServer())
        .post('/doctor')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newDoctor)
        .expect(201)
        .then((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.title).toEqual(newDoctor.name);
          doctorCreated = res.body;
        });
    });

    it('(GET) - Get all Doctors', async () => {
      return request(app.getHttpServer())
        .get('/doctor')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });

    it('(GET) - Get a Doctor by ID', async () => {
      return request(app.getHttpServer())
        .get(`/doctor/${doctorCreated?.id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toEqual(doctorCreated.id);
        });
    });

    it('(PUT) - Update a Doctor by ID', async () => {
      const doctor = { name: 'Updated name',category:Category.CARDIOLOGIST };
      return request(app.getHttpServer())
        .put(`/doctor/${doctorCreated?.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(doctor)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(doctor.name);
        });
    });

    it('(DELETE) - Delete a Doctor by ID', async () => {
      return request(app.getHttpServer())
        .delete(`/doctor/${doctorCreated?.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.deleted).toEqual(true);
        });
    });
  });
});
