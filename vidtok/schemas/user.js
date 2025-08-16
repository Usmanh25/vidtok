export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email()
    },
    {
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'passwordHash',
      title: 'Password Hash',
      type: 'string',
      hidden: true // Don't show in the Studio UI
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,  // optional cropping UI
      },
      // optional: validation if you want to enforce profile image presence
      // validation: Rule => Rule.required()
    }
  ]
};
