'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import {
  AutoStories as CreateIcon,
  MenuBook as ReadIcon,
  Person as PersonIcon,
  Edit as WriteIcon,
  Palette as ArtIcon,
  Group as ShareIcon,
  School as LearnIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  FavoriteBorder as FavoriteIcon,
  Shield as ShieldIcon,
  SupervisorAccount as ParentIcon,
} from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '3.5rem' }, 
            fontWeight: 'bold', 
            color: 'primary.main', 
            mb: 2 
          }}
        >
          Welcome to StoryForge! ✨
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.25rem', md: '1.5rem' }, 
            color: 'text.secondary', 
            maxWidth: '600px', 
            mx: 'auto', 
            mb: 4,
            lineHeight: 1.6 
          }}
        >
          Create amazing adventures with AI magic! 📚
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ justifyContent: 'center', maxWidth: '600px', mx: 'auto' }}
        >
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<CreateIcon />}
            sx={{ minWidth: 180, py: 1.5 }}
            component={Link}
            href="/create"
          >
            ✨ Start Creating!
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ReadIcon />}
            sx={{ minWidth: 180, py: 1.5, backgroundColor: '#f59e0b', '&:hover': { backgroundColor: '#d97706' } }}
            component={Link}
            href="/read"
          >
            📖 Read Stories
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonIcon />}
            sx={{ minWidth: 180, py: 1.5, backgroundColor: '#8b5cf6', '&:hover': { backgroundColor: '#7c3aed' } }}
            component={Link}
            href="/characters"
          >
            👤 Make Characters
          </Button>
        </Stack>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'primary.main', 
            textAlign: 'center', 
            mb: 4 
          }}
        >
          What Can You Do? 🤔
        </Typography>
        
                 <Box 
           sx={{ 
             display: 'grid', 
             gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, 
             gap: 4 
           }}
         >
           <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
             <CardContent>
               <Box sx={{ fontSize: '4rem', mb: 2 }}>📝</Box>
               <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                 Write Stories
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 Create awesome adventures with help from AI! Make stories about anything you can imagine!
               </Typography>
             </CardContent>
           </Card>
           
           <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
             <CardContent>
               <Box sx={{ fontSize: '4rem', mb: 2 }}>🎨</Box>
               <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                 Make Pictures
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 AI will draw pictures for your stories! Watch your characters and places come to life!
               </Typography>
             </CardContent>
           </Card>
           
           <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
             <CardContent>
               <Box sx={{ fontSize: '4rem', mb: 2 }}>👥</Box>
               <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                 Share Safely
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 Share your stories with friends! Parents can help you decide what to share.
               </Typography>
             </CardContent>
           </Card>
           
           <Card sx={{ textAlign: 'center', p: 3, height: '100%' }}>
             <CardContent>
               <Box sx={{ fontSize: '4rem', mb: 2 }}>🎓</Box>
               <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                 Learn & Grow
               </Typography>
               <Typography variant="body1" color="text.secondary">
                 Get better at writing and storytelling! Earn cool badges for your achievements!
               </Typography>
             </CardContent>
           </Card>
         </Box>
      </Box>

      {/* Sample Stories Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: 'primary.main', 
            textAlign: 'center', 
            mb: 4 
          }}
        >
          Check Out These Cool Stories! ⭐
        </Typography>
        
                 <Box 
           sx={{ 
             display: 'grid', 
             gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
             gap: 4 
           }}
         >
             <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
               <CardContent sx={{ flexGrow: 1 }}>
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                     <Box sx={{ fontSize: '1.5rem' }}>📚</Box>
                     <Box>
                       <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                         The Magic Forest Adventure
                       </Typography>
                       <Typography variant="body2" color="text.secondary">
                         by Alex, age 9
                       </Typography>
                     </Box>
                   </Box>
                   <IconButton size="small">
                     <FavoriteIcon />
                   </IconButton>
                 </Box>
                 
                 <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                   Join Emma as she discovers a hidden forest full of talking animals and magical surprises! What will she find next?
                 </Typography>
                 
                 <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                   <Chip label="Adventure" size="small" />
                   <Chip label="Magic" size="small" />
                   <Chip label="Animals" size="small" />
                 </Stack>
                 
                 <Divider sx={{ my: 2 }} />
                 
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                       <TimeIcon fontSize="small" />
                       <Typography variant="body2">5 min</Typography>
                     </Box>
                     <Chip label="Easy" size="small" color="success" />
                   </Box>
                   <Button variant="contained" size="small">
                     Read Now! 📖
                   </Button>
                 </Box>
               </CardContent>
             </Card>
           
           <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
             <CardContent sx={{ flexGrow: 1 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                   <Box sx={{ fontSize: '1.5rem' }}>📚</Box>
                   <Box>
                     <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                       Mystery of the Missing Cookies
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       by Maya, age 10
                     </Typography>
                   </Box>
                 </Box>
                 <IconButton size="small">
                   <FavoriteIcon />
                 </IconButton>
               </Box>
               
               <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                 Someone took all the cookies from the kitchen! Help Detective Sam solve this yummy mystery before dinner time!
               </Typography>
               
               <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                 <Chip label="Mystery" size="small" />
                 <Chip label="Detective" size="small" />
                 <Chip label="Funny" size="small" />
               </Stack>
               
               <Divider sx={{ my: 2 }} />
               
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                     <TimeIcon fontSize="small" />
                     <Typography variant="body2">8 min</Typography>
                   </Box>
                   <Chip label="Medium" size="small" color="warning" />
                 </Box>
                 <Button variant="contained" size="small">
                   Read Now! 📖
                 </Button>
               </Box>
             </CardContent>
           </Card>
           
           <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
             <CardContent sx={{ flexGrow: 1 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                   <Box sx={{ fontSize: '1.5rem' }}>📚</Box>
                   <Box>
                     <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                       Space Dragon Rescue
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       by Jordan, age 11
                     </Typography>
                   </Box>
                 </Box>
                 <IconButton size="small">
                   <FavoriteIcon />
                 </IconButton>
               </Box>
               
               <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                 Captain Zoe must save friendly dragons from the mean space pirates! An epic adventure among the stars awaits!
               </Typography>
               
               <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                 <Chip label="Space" size="small" />
                 <Chip label="Dragons" size="small" />
                 <Chip label="Heroes" size="small" />
               </Stack>
               
               <Divider sx={{ my: 2 }} />
               
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                     <TimeIcon fontSize="small" />
                     <Typography variant="body2">12 min</Typography>
                   </Box>
                   <Chip label="Medium" size="small" color="warning" />
                 </Box>
                 <Button variant="contained" size="small">
                   Read Now! 📖
                 </Button>
               </Box>
             </CardContent>
           </Card>
         </Box>
      </Box>

      {/* Safety Message */}
      <Paper 
        sx={{ 
          backgroundColor: 'background.paper', 
          borderRadius: 3, 
          p: 4, 
          textAlign: 'center',
          border: '2px solid',
          borderColor: 'primary.main'
        }}
      >
        <Box sx={{ fontSize: '3rem', mb: 2 }}>🛡️</Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          Safe & Fun for Everyone!
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: '600px', mx: 'auto', lineHeight: 1.6, mb: 3 }}
        >
          StoryForge is super safe! Our AI only creates nice, fun stories. 
          Your parents can see everything you make, and we never share your information with strangers.
        </Typography>
        <Button
          variant="outlined"
          color="warning"
          size="large"
          startIcon={<ParentIcon />}
          component={Link}
          href="/parent"
          sx={{ py: 1.5, px: 3 }}
        >
          👨‍👩‍👧‍👦 Parent Info
        </Button>
      </Paper>
    </Container>
  );
}