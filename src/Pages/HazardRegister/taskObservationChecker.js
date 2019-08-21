export const taskObservationChecker = values => {
  const choiceValues = location => {
    if (values[location]) {
      if (values[location].choice_values) {
        return values[location].choice_values[0];
      } else return;
    } else return;
  };

  return [
    {
      values,
      comments: values['87d5'],
      assignedTo: choiceValues('2b6d'),
      closeOutDate: values['f8f0'] ? values['f8f0'] : null,
      closeOutLocation: 'f8f0'
    },
    {
      values,
      comments: values['acb6'],
      assignedTo: choiceValues('71b3'),
      closeOutDate: values['fa6d'] ? values['fa6d'] : null,
      closeOutLocation: 'fa6d'
    },
    {
      values,
      comments: values['f94a'],
      assignedTo: choiceValues('1db9'),
      closeOutDate: values['aef2'] ? values['aef2'] : null,
      closeOutLocation: 'aef2'
    },
    {
      values,
      comments: values['497e'],
      assignedTo: choiceValues('db3b'),
      closeOutDate: values['3400'] ? values['3400'] : null,
      closeOutLocation: '3400'
    },
    {
      values,
      comments: values['f2ed'],
      assignedTo: choiceValues('d6ff'),
      closeOutDate: values['c4f6'] ? values['c4f6'] : null,
      closeOutLocation: 'c4f6'
    }
  ];
};
