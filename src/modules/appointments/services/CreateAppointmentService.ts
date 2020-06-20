import { startOfHour } from 'date-fns';
import {injectable,inject} from 'tsyringe';


import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'


/**
 * Recebimento das infomações
 * Tratativa de erros/execessẽoes
 * Acesso ao repositorio
 */
/**
 * Dependency Inversion (SOLID)
 */


interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

    public async execute({ date, provider_id }: IRequest): Promise<Appointment> {

      const appointmentDate = startOfHour(date); //hora em hora - regra de negocio

      const findAppointmentInSameDate =  await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if(findAppointmentInSameDate) {
      throw new AppError('This appointment is already boocked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
