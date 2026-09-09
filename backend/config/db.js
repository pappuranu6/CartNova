import mongoose from 'mongoose'
import dns from 'dns'

dns.setServers(['8.8.8.8'])

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)

    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB