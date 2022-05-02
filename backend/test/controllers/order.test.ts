
   
import request from 'supertest'

import { OrderDocument } from '../../models/order'
import app from '../../app'
import connect, { MongodHelper } from '../db-helper'

const nonExistingOrderId = '5e57b77b5744fa0b461c7906'
const nonExistingUserId = '5e57b77b5744fa0b461c7906'

const existingUserId = '6229f9524f07b73d003e72f4'
const existingOrderLineId = '6229f8df4f07b73d003e72eb'
