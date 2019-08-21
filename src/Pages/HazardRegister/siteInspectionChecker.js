export const siteInspectionChecker = values => {
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
      comments: values['9e1d'],
      assignedTo: choiceValues('a0cd'),
      closeOutDate: values['ea3d'] ? values['ea3d'] : null,
      closeOutLocation: 'ea3d'
    },
    {
      values,
      comments: values['9e31'],
      assignedTo: choiceValues('dde5'),
      closeOutDate: values['a58d'] ? values['a58d'] : null,
      closeOutLocation: 'a58d'
    },
    {
      values,
      comments: values['bce7'],
      assignedTo: choiceValues('84a1'),
      closeOutDate: values['87e9'] ? values['87e9'] : null,
      closeOutLocation: '87e9'
    },
    {
      values,
      comments: values['f612'],
      assignedTo: choiceValues('eb8f'),
      closeOutDate: values['aa50'] ? values['aa50'] : null,
      closeOutLocation: 'aa50'
    },
    {
      values,
      comments: values['9305'],
      assignedTo: choiceValues('9005'),
      closeOutDate: values['2741'] ? values['2741'] : null,
      closeOutLocation: '2741'
    },
    {
      values,
      comments: values['a933'],
      assignedTo: choiceValues('0bca'),
      closeOutDate: values['69f2'] ? values['69f2'] : null,
      closeOutLocation: '69f2'
    },
    {
      values,
      comments: values['f99c'],
      assignedTo: choiceValues('169c'),
      closeOutDate: values['aa68'] ? values['aa68'] : null,
      closeOutLocation: 'aa68'
    },
    {
      values,
      comments: values['a03d'],
      assignedTo: choiceValues('bec3'),
      closeOutDate: values['e360'] ? values['e360'] : null,
      closeOutLocation: 'e360'
    },
    {
      values,
      comments: values['9d38'],
      assignedTo: choiceValues('65f1'),
      closeOutDate: values['4ea7'] ? values['4ea7'] : null,
      closeOutLocation: '4ea7'
    },
    {
      values,
      comments: values['d2db'],
      assignedTo: choiceValues('138e'),
      closeOutDate: values['0ced'] ? values['0ced'] : null,
      closeOutLocation: '0ced'
    },
    {
      values,
      comments: values['6b41'],
      assignedTo: choiceValues('b44d'),
      closeOutDate: values['3c95'] ? values['3c95'] : null,
      closeOutLocation: '3c95'
    },
    {
      values,
      comments: values['8f9e'],
      assignedTo: choiceValues('ff59'),
      closeOutDate: values['1267'] ? values['1267'] : null,
      closeOutLocation: '1267'
    },
    {
      values,
      comments: values['a630'],
      assignedTo: choiceValues('1c39'),
      closeOutDate: values['0edd'] ? values['0edd'] : null,
      closeOutLocation: '0edd'
    },
    {
      values,
      comments: values['76d4'],
      assignedTo: choiceValues('4799'),
      closeOutDate: values['3053'] ? values['3053'] : null,
      closeOutLocation: '3053'
    },
    {
      values,
      comments: values['0451'],
      assignedTo: choiceValues('c457'),
      closeOutDate: values['948a'] ? values['948a'] : null,
      closeOutLocation: '948a'
    },
    {
      values,
      comments: values['25ad'],
      assignedTo: choiceValues('5268'),
      closeOutDate: values['ff7a'] ? values['ff7a'] : null,
      closeOutLocation: 'ff7a'
    },
    {
      values,
      comments: values['1f36'],
      assignedTo: choiceValues('2d79'),
      closeOutDate: values['c7c6'] ? values['c7c6'] : null,
      closeOutLocation: 'c7c6'
    },
    {
      values,
      comments: values['85ca'],
      assignedTo: choiceValues('060e'),
      closeOutDate: values['4050'] ? values['4050'] : null,
      closeOutLocation: '4050'
    }
    // {
    //   values,
    //   comments: values['0923'],
    //   assignedTo: choiceValues('91dd'),
    //   closeOutDate: values['c7b5'] ? values['c7b5'] : null,
    //   closeOutLocation: 'c7b5'
    // }
  ];
};
