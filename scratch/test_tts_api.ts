import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database connection...')
  try {
    const userCount = await prisma.user.count()
    console.log(`Found ${userCount} users.`)
    
    const firstUser = await prisma.user.findFirst({
      include: { children: true }
    })
    
    if (firstUser) {
      console.log(`First user: ${firstUser.email}`)
      console.log(`Children: ${firstUser.children.length}`)
      
      if (firstUser.children.length > 0) {
        const firstChild = firstUser.children[0]
        console.log(`First child: ${firstChild.name} (ID: ${firstChild.id})`)
        
        const settings = await prisma.ttsSettings.findUnique({
          where: { childProfileId: firstChild.id }
        })
        
        if (settings) {
          console.log('Settings found:', settings)
        } else {
          console.log('No settings found. Attempting to create...')
          const newSettings = await prisma.ttsSettings.create({
            data: {
              childProfileId: firstChild.id,
              autoplay: true,
              soundEnabled: true,
              repeatCount: 1,
              speed: 1.0,
            }
          })
          console.log('Created settings:', newSettings)
        }
      }
    }
  } catch (e) {
    console.error('Error during test:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
