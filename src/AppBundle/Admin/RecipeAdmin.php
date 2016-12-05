<?php

namespace AppBundle\Admin;

use AppBundle\Entity\Category;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class RecipeAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {

        $formMapper
            ->tab('Рецепт')
                ->with('admin.news.full_title', ['class' => 'col-md-7'])
                    ->add('title', 'text', [
                        'label' => 'admin.news.short_title'
                    ])
                    ->add('description', 'textarea', [
                        'label' => 'admin.news.short_desciription',
                        'attr' => ['class' => 'ckeditor']
                    ])
                ->end()
            ->end()
            ->tab('Ингредиенты')
                ->with('хммм')
//                    ->add('ingredient', 'sonata_type_model', [
//                        'class' => 'AppBundle\Entity\Ingredients'
//                    ])
                ->end()
            ->end()
        ;

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {

        $datagridMapper
            ->add('title')
        ;

    }

    protected function configureListFields(ListMapper $listMapper)
    {

        $listMapper
            ->addIdentifier('title', 'text', [
                'label' => 'admin.news.id',
            ])
        ;

    }
}
