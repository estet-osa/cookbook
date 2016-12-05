<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Ivory\CKEditorBundle\Form\Type\CKEditorType;

class RecipeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', TextType::class, array(
                    'label'=> 'Название блюда',
                    'required'  => true,
                    'attr' => array(
                        'placeholder' => 'Название блюда',
                        'class' => 'recipe_inpt'
                    )
            ))
            ->add('description', CKEditorType::class, array(
                'label'=> 'Описание блюда',
                'required'  => true,
                'config' => array(
                    'uiColor' => '#ffffff',
                ),
            ))
            ->add('brochure', FileType::class, [
                'label' => 'Attach image',
                'data_class' => null
            ])
            ->add('ingredient', CollectionType::class, array(
                'entry_type' => IngredientsType::class,
                'allow_add'    => true,
            ))
            ->add('save', SubmitType::class, [
                'label' => 'Сохранить',
                'attr'  => array(
                    'class' => 'save_btn'
                )
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Recipe',
        ));
    }
}
